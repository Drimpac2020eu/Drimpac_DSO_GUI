import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { XmlRequests } from '../../@theme/services/xmlRequests/xmlposts.service';
import { iflex } from '../../@theme/services/xmlRequests/xmlposts.service';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as momenttz from 'moment-timezone';
import { ɵNgStyleR2Impl } from '@angular/common';



@Component({
  selector: 'ngx-usef',
  styleUrls: ['./flexRequest.component.scss'],
  providers: [XmlRequests],
  templateUrl: './flexRequest.component.html',
})
export class FlexRequestComponent implements OnInit {
  colorsred=['#ffcccc', '#ff9999', '#ff6666'];
  numbers: string;
  message: string;
  messageQueue = Object;
  messageQueue2 = Object;
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
  Timeseries = [];
  nameH = 'Prognosis TimeSeries';
  nameHD = 'Program Time Units';
  nameV = 'Watt';

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
        title: 'Duration',
      },
    },
  };

  userSource: LocalDataSource = new LocalDataSource();
  userSourcePTU: LocalDataSource = new LocalDataSource();

  @Output() select: EventEmitter<number> = new EventEmitter();

  constructor(private XmlReq: XmlRequests) {

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

    this.XmlReq.getPrognosis().then(
      events => {
        this.messageQueue = events['body'];
        console.log(this.messageQueue);
        let list = new Array();
        for (let i = 0; i < this.messageQueue.length; i++) {
          list.unshift(this.messageQueue[i]['Prognosis']['Sequence']);
        }
        this.sequence = list;
      });

    this.prognosisForm = new FormGroup({
      'CongestionPoint': new FormControl(null),
    });

    this.XmlReq.getConfigFile().then(
      events => {
        console.log(JSON.parse(events['body']));
      });
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
    if (this.table !== null) {
      console.log(this.table);

      this.numbers = "";
      for (let i = 1; i < 96; i++) {
        this.numbers += i.toString() + ',';
      }
      this.numbers += '96';
      //const str2=this.table[4]['type2'] + '/' + this.table[2]['type2'] + '/' + numbers;

      var fl = new Array();
      fl.push(this.table[4]['type2'], this.table[2]['type2'], this.numbers);

      console.log(fl);
      this.XmlReq.createFlexrequest(fl).then(results => {
        this.message = JSON.stringify(results);
      });

    }
  };

  handleDropDown(event: any) {

    this.sequenceval = event.target.value;
    console.log(this.sequenceval);
    this.table = [];
    this.Timeseries = [];
    for (let i = 0; i < this.messageQueue.length; i++) {
      if (event.target.value === this.messageQueue[i]['Prognosis']['Sequence']) {
        this.table = [];
        this.tablePTU = [];
        this.table.push({ type1: 'Type', type2: this.messageQueue[i]['Prognosis']['Type'] });
        this.table.push({ type1: 'PTU-Duration', type2: this.messageQueue[i]['Prognosis']['PTU-Duration'] });
        this.table.push({ type1: 'Period', type2: this.messageQueue[i]['Prognosis']['Period'] });
        this.table.push({ type1: 'TimeZone', type2: this.messageQueue[i]['Prognosis']['TimeZone'] });
        this.table.push({ type1: 'CongestionPoint', type2: this.messageQueue[i]['Prognosis']['CongestionPoint'] });
        this.table.push({ type1: 'Sequence', type2: this.messageQueue[i]['Prognosis']['Sequence'] });
        this.table.push({ type1: 'SenderDomain', type2: this.messageQueue[i]['Prognosis']['MessageMetadata']['SenderDomain'] });
        this.userSource.load(this.table);
        //chart


        for (let y = 0; y < this.messageQueue[i]['Prognosis']['PTU'].length; y++) {
          this.tablePTU.push({
            type1: this.messageQueue[i]['Prognosis']['PTU'][y]['Power'],
            type2: this.messageQueue[i]['Prognosis']['PTU'][y]['Start'],
            type3: this.messageQueue[i]['Prognosis']['PTU'][y]['Duration'],
          });



          this.userSourcePTU.load(this.tablePTU);
          for (let l = 0; l < this.messageQueue[i]['Prognosis']['PTU'][y]['Duration']; l++) {
            this.Timeseries.push(this.messageQueue[i]['Prognosis']['PTU'][y]['Power']);
          }

        }



      }

    }

  };

}
