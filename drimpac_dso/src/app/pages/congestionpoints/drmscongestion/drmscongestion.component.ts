import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { XmlRequests } from '../../../@theme/services/xmlRequests/xmlposts.service';
import { iflex } from '../../../@theme/services/xmlRequests/xmlposts.service';
import {iConnection} from '../../../@theme/services/xmlRequests/xmlposts.service';
import {iCongestion} from '../../../@theme/services/xmlRequests/xmlposts.service';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as momenttz from 'moment-timezone';
import { ɵNgStyleR2Impl } from '@angular/common';

@Component({
  selector: 'ngx-usef',
  styleUrls: ['./drmscongestion.component.scss'],
  providers: [XmlRequests],
  templateUrl: './drmscongestion.component.html',
})
export class DrmscongestionComponent implements OnInit {

  numbers:string;
  message:string;
  messageQueue = Object;
  messageQueue2 = Object;
  activeModel: string = '';
  transitionController = new TransitionController();
  flexReqForm: FormGroup;
  ptuform: FormGroup;
  timeZones: any;
prognoses:any;
prognosisForm: FormGroup;
sequence:any;
sequenceval:any;
table = [];
tablePTU= [];
drms:any;
dsoname:string;
userSettings = {
  actions: false,
  hideSubHeader: true,
  add:{
    addButtonContent: '<i class="nb-plus-circled"></i>',
    createButtonContent: '<i class="nb-plus"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',
  },
 
  delete: {
    deleteButtonContent: '<i class="nb-trash"></i>',
   
  },
      columns: {
        type1: {
          title: 'Connection',
        },
      },
    };


    userSettingsPTU = {
      actions: false,
      hideSubHeader: true,
      add:{
        addButtonContent: '<i class="nb-plus-circled"></i>',
        createButtonContent: '<i class="nb-plus"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
     
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
       
      },
          columns: {
            type1: {
              title: 'Power',
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

    this.XmlReq.getConfigFile().then(
      events => {
       // console.log(JSON.parse(events['body'])['nodes'][0]['processes'][2]['domain-name']);
        this.dsoname="ea1."+ moment().format('YYYY-MM') + '.';
        this.dsoname+=JSON.parse(events['body'])['nodes'][0]['processes'][2]['domain-name'] + ':';
        console.log(this.dsoname);
      });
    
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
 this.timeZones =  momenttz.tz.names();

    this.ptuform = new FormGroup({
      'ptuDisposition': new FormControl("Available"),
      'Power': new FormControl(null),
      'Start': new FormControl(null),
      'Duration': new FormControl(null),
      'Price': new FormControl(null),
    });

    this.XmlReq.getDrmsCong().then(
      events => {
        this.messageQueue = events['results'];
        console.log( this.messageQueue);
        let list =new Array();
        for (let i = 0; i <this.messageQueue.length; i++)
        {
          if (this.messageQueue[i]['systemUUID']!==undefined)
          {
             list.unshift(this.dsoname + this.messageQueue[i]['systemUUID']);
          }
        }
        this.sequence = list;
      });

      this.prognosisForm = new FormGroup({
        'CongestionPoint': new FormControl(null),
      });

  }

 

  

  public animateInfo(controller, transitionName: string = 'slide down', id) {
    this.activeModel = id;
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
  }
  
  handleClick() {

    let tmp = Array<iConnection>(this.userSource['data'].length);
    for (let i=0; i<this.userSource['data'].length; i++)
    {
      tmp[i]={entityAddress: this.userSource['data'][i]['type1']}
    }

    let temp  =Array<iCongestion>();
    temp.push({method: 'POST', entityAddress: this.sequenceval ,connections: tmp});

    console.log(temp);

    this.XmlReq.addNewCongestion( temp)
    .then(results => {
      this.message = JSON.stringify(results);
    });
    //if (this.table!==null)
   // {
   // console.log(this.table);

   // this.numbers = "";
   // for (let i=1;i<96;i++)
  //  {
   //   this.numbers+=i.toString()+',';
   // }
  //  this.numbers+='96';
    //const str2=this.table[4]['type2'] + '/' + this.table[2]['type2'] + '/' + numbers;
  
  //  var fl = new Array();
  //  fl.push ( this.table[4]['type2'] ,this.table[2]['type2'] , this.numbers);
   
  //  console.log(fl);
  // this.XmlReq.createFlexrequest(fl) .then(results => {
  //    this.message = JSON.stringify(results);
 //});

  //}
  };

  handleDropDown(event: any) {

    this.sequenceval = event.target.value;
    console.log(this.sequenceval);
    this.table=[];
    for (let i = 0; i <this.messageQueue.length; i++)
    {
      
      if ((event.target.value).substring(this.dsoname.length) === this.messageQueue[i]['systemUUID'])
      {
        this.table=[];
        this.tablePTU= [];
        this.table.push({type1: this.messageQueue[i]['pccId']}, );
       
        this.userSource.load(this.table);
      }
      
    }
    
  };

}
