import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { XmlRequests } from '../../@theme/services/xmlRequests/xmlposts.service';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as momenttz from 'moment-timezone';


@Component({
  selector: 'ngx-usef',
  styleUrls: ['./flexOfferRevoke.component.scss'],
  providers: [XmlRequests],
  templateUrl: './flexOfferRevoke.component.html',
})
export class FlexOfferRevokeComponent implements OnInit {

  message: string;
  messageQueue = Object;
  messageQueue2 = Object;
  revokeQueue = Object;
  activeModel: string = '';
  transitionController = new TransitionController();
  flexReqForm: FormGroup;
  ptuform: FormGroup;
  timeZones: any;
  prognoses: any;
  prognosisForm: FormGroup;
  sequence: any;
  sequenceval: any;
  table = [];
  tablePTU = [];
  tableRevoke = [];
  Timeseries = [];
  nameH = 'Flexibility Order TimeSeries';
  nameHD = 'Program Time Units';
  nameV = 'Watt';

  Timeseries2 = [];
  nameH2 = 'Flexibility Order TimeSeries Price';
  nameHD2 = 'Program Time Units';
  nameV2 = 'Price';

  userSettings = {
    actions: false,
    hideSubHeader: true,
    add: {
      addButtonContent: '<i class="nb-plus-circled"></i>',
      createButtonContent: '<i class="nb-plus"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },

    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',

    },
    columns: {
      type1: {
        title: 'Type',
      },
      type2: {
        title: 'Value',
      },
    },
  };


  userSettingsPTU = {
    actions: false,
    hideSubHeader: true,
    add: {
      addButtonContent: '<i class="nb-plus-circled"></i>',
      createButtonContent: '<i class="nb-plus"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },

    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',

    },
    columns: {
      type1: {
        title: 'Power (Watt)',
      },
      type2: {
        title: 'Start',
      },
      type3: {
        title: 'Price (EUR)',
      },
    },
  };

  revokesequense = {
    actions: false,
    hideSubHeader: true,
    add: {
      addButtonContent: '<i class="nb-plus-circled"></i>',
      createButtonContent: '<i class="nb-plus"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },

    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',

    },
    columns: {
      type1: {
        title: 'Sequence',
      },
      type2: {
        title: 'Result',
      },
      type3: {
        title: 'Message',
      },
    },
  };

  userSource: LocalDataSource = new LocalDataSource();
  userSourcePTU: LocalDataSource = new LocalDataSource();
  title: string;
  @Output() select: EventEmitter<number> = new EventEmitter();

  constructor(private XmlReq: XmlRequests) {


    //    this.XmlReq.getCROs().then(
    //      events => {
    //       this.messageQueue = events['body'];
    //       console.log(events['body']);
    //    });

    //    this.XmlReq.getSynchronisationCongestionpoints().then(
    //      events => {
    //        this.messageQueue2 = events['body'];
    //      console.log(events['body']);
    //   });
  }

  ngOnInit() {
    this.flexReqForm = new FormGroup({
      'ptu-Duration': new FormControl(null),
      'unit_Period': new FormControl(null),
      'unit_TimeZone': new FormControl(null),
      'unit_Expiration': new FormControl(null),
      'unit_PrognosisOrigin': new FormControl(null),
      'unit_PrognosisSequence': new FormControl(null),


      'unit_CongestionPoint': new FormControl(null),
      'unit_Sequence': new FormControl(null),

      'SenderDomain': new FormControl(null),
      'SenderRole': new FormControl("DSO"),
      'RecipientDomain': new FormControl(null),
      'RecipientRole': new FormControl("AGR"),
      'Precedence': new FormControl("Critical"),
      'ValidUntil': new FormControl(null),

    }

    );
    this.flexReqForm.get("ValidUntil").setValue(moment().format());
    this.timeZones = momenttz.tz.names();

    this.ptuform = new FormGroup({
      'ptuDisposition': new FormControl("Available"),
      'Power': new FormControl(null),
      'Start': new FormControl(null),
      'Duration': new FormControl(null),
      'Price': new FormControl(null),
    });

    this.XmlReq.getFlexOrder().then(
      events => {
        this.messageQueue = events['body'];
        console.log(this.messageQueue);
        let list = new Array();
        for (let i = 0; i < this.messageQueue.length; i++) {
          list.unshift(this.messageQueue[i]['FlexOrder']['Sequence']);
        }
        this.sequence = list;
      });

    this.prognosisForm = new FormGroup({
      'CongestionPoint': new FormControl(null),
    });

    // this.XmlReq.getrevokeflexoffer().then(events => {
    //   this.revokeQueue = events['body'];
    //   console.log( this.revokeQueue);
    //   this.tableRevoke=[];
    //   for (let i = 0; i <this.revokeQueue.length; i++)
    //   {
    //     this.tableRevoke.push({type1: this.revokeQueue[i]['FlexOfferRevocationResponse']['Sequence'], 
    //     type2: this.revokeQueue[i]['FlexOfferRevocationResponse']['Result'],
    //     type3: this.revokeQueue[i]['FlexOfferRevocationResponse']['Message'],
    //   });
    //   }
    // });
  }



  handleDropDown2(str: string, event: any) {
    this.ptuform.get(str).setValue(event.target.value);
  };

  public animateInfo(controller, transitionName: string = 'slide down', id) {
    this.activeModel = id;
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
  }

  handleClick() {
    console.log(this.sequenceval);
    //  this.XmlReq.FlexOrderEvent().then(
    //   results => {
    //     this.message = JSON.stringify(results);
    // });
    if (this.sequenceval != undefined) {
      var fl = new Array();
      for (let i = 0; i < this.messageQueue.length; i++) {
        if (this.sequenceval === this.messageQueue[i]['FlexOrder']['Sequence']) {
          fl.push(this.messageQueue[i]['FlexOrder']['MessageMetadata']['SenderDomain'], this.sequenceval, this.messageQueue[i]['FlexOrder']['FlexRequestOrigin'], 'DSO');
        }
      }
      console.log(fl);
      this.XmlReq.revokeflexoffer(fl).then(results => {
        this.message = JSON.stringify(results);
      });
    };
  }
  handleDropDown(event: any) {

    this.sequenceval = event.target.value;
    console.log(this.sequenceval);
    this.table = [];
    this.Timeseries = [];
    this.Timeseries2 = [];

    for (let i = 0; i < this.messageQueue.length; i++) {
      if (event.target.value === this.messageQueue[i]['FlexOrder']['Sequence']) {
        this.table = [];
        this.tablePTU = [];
        this.table.push({ type1: 'FlexOfferOrigin', type2: this.messageQueue[i]['FlexOrder']['FlexOfferOrigin'] });
        this.table.push({ type1: 'FlexOfferSequence', type2: this.messageQueue[i]['FlexOrder']['FlexOfferSequence'] });
        this.table.push({ type1: 'Currency', type2: this.messageQueue[i]['FlexOrder']['Currency'] });
        this.table.push({ type1: 'PTU-Duration', type2: this.messageQueue[i]['FlexOrder']['PTU-Duration'] });
        this.table.push({ type1: 'Period', type2: this.messageQueue[i]['FlexOrder']['Period'] });
        this.table.push({ type1: 'CongestionPoint', type2: this.messageQueue[i]['FlexOrder']['CongestionPoint'] });
        this.table.push({ type1: 'ExpirationDateTime', type2: this.messageQueue[i]['FlexOrder']['ExpirationDateTime'] });
        this.table.push({ type1: 'Sequence', type2: this.messageQueue[i]['FlexOrder']['Sequence'] });
        this.table.push({ type1: 'SenderDomain', type2: this.messageQueue[i]['FlexOrder']['MessageMetadata']['SenderDomain'] });
        this.userSource.load(this.table);
        for (let y = 0; y < this.messageQueue[i]['FlexOrder']['PTU'].length; y++) {
          this.tablePTU.push({
            type1: this.messageQueue[i]['FlexOrder']['PTU'][y]['Power'],
            type2: this.messageQueue[i]['FlexOrder']['PTU'][y]['Start'],
            type3: this.messageQueue[i]['FlexOrder']['PTU'][y]['Price'],
          });


          //   this.Timeseries.push(this.messageQueue[i]['FlexOffer']['PTU'][y]['Power'])
          //   this.Timeseries2.push(this.messageQueue[i]['FlexOffer']['PTU'][y]['Price'])
          if (this.messageQueue[i]['FlexOrder']['PTU'][y]['Duration'] != undefined) {
            for (let l = 0; l < this.messageQueue[i]['FlexOrder']['PTU'][y]['Duration']; l++) {
              this.Timeseries.push(this.messageQueue[i]['FlexOrder']['PTU'][y]['Power']);
              this.Timeseries2.push(this.messageQueue[i]['FlexOrder']['PTU'][y]['Price']);
            }

          }
          else {
            this.Timeseries.push(this.messageQueue[i]['FlexOrder']['PTU'][y]['Power']);
            this.Timeseries2.push(this.messageQueue[i]['FlexOrder']['PTU'][y]['Price']);
          }


        }
        this.userSourcePTU.load(this.tablePTU);

      }

    }

  };

}
