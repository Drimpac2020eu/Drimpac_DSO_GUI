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
  styleUrls: ['./activeaggregators.component.scss'],
  providers: [XmlRequests],
  templateUrl: './activeaggregators.component.html',
})
export class ActiveAggregatorsComponent implements OnInit {

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
        title: 'Aggregator',
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


    this.XmlReq.getActiveAggregators().then(
      events => {
        this.messageQueue = events['body'];
        console.log(this.messageQueue);
        this.tablePTU = [];
        for (let i = 0; i < this.messageQueue.length; i++) {

          this.tablePTU.push({
            type1: this.messageQueue[i]['DOMAIN'],
          });
          //   }
          this.userSourcePTU.load(this.tablePTU);

        }

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
    this.tablePTU = [];
    for (let i = 0; i < this.messageQueue.length; i++) {
      if (event.target.value === this.messageQueue[i]['CONNECTION_GROUP_ID']) {


        // for (let y = 0; y <this.messageQueue.length; y++)
        //  {    
        this.tablePTU.push({
          type1: this.messageQueue[i]['CONNECTION_ID'],
          type2: this.messageQueue[i]['VALID_FROM'],
          type3: this.messageQueue[i]['VALID_UNTIL'],
        });
        //   }
        this.userSourcePTU.load(this.tablePTU);
      }

    }

  };

}
