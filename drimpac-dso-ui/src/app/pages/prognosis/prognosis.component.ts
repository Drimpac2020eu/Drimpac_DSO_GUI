import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { XmlRequests } from '../../@theme/services/xmlRequests/xmlposts.service';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as momenttz from 'moment-timezone';
import {IMessageMetadata} from '../../@theme/services/xmlRequests/xmlposts.service';
import { AnyTxtRecord } from 'dns';

@Component({
  selector: 'ngx-usef',
  styleUrls: ['./prognosis.component.scss'],
  providers: [XmlRequests],
  templateUrl: './prognosis.component.html',
})
export class PrognosisComponent implements OnInit {

  messageQueue = Object;
  messageQueue2 = Object;
  activeModel: string = '';
  transitionController = new TransitionController();
  PrognosisForm: FormGroup;
  ptuForm: FormGroup;
  messagedata: IMessageMetadata;
  timeZones: any;
  showCongestionPoint: boolean;

  @Output() select: EventEmitter<number> = new EventEmitter();

  constructor(private XmlReq: XmlRequests) {

    this.messagedata = {SenderDomain:null,SenderRole:null,RecipientDomain:null,RecipientRole:null,
      Precedence:null,ValidUntil:null};
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
    this.PrognosisForm = new FormGroup({
      'Type': new FormControl("D-Prognosis"),
      'PTUDuration': new FormControl(null),
      'Period': new FormControl(null),
      'TimeZone': new FormControl(null),
      'CongestionPoint': new FormControl(null),

      
      'Connection': new FormControl(null),
      'SenderDomain': new FormControl(null),
      'SenderRole': new FormControl("DSO"),
      'RecipientDomain': new FormControl(null),
      'RecipientRole': new FormControl("AGR"),
      'Precedence': new FormControl("Critical"),
      'ValidUntil': new FormControl(null),
    });
    this.showCongestionPoint = true;
    this.PrognosisForm.get("ValidUntil").setValue(moment().format());
    this.timeZones =  momenttz.tz.names();
    

    this.ptuForm = new FormGroup({
      'Power': new FormControl(null),
      'Start': new FormControl(null),
      'Duration': new FormControl(null),
    });
  }

  handleClick() {
    console.log(this.PrognosisForm.get("SenderDomain").value);
    this.messagedata.SenderDomain = this.PrognosisForm.get("SenderDomain").value;
    this.messagedata.SenderRole = this.PrognosisForm.get("SenderRole").value;
    this.messagedata.RecipientDomain = this.PrognosisForm.get("RecipientDomain").value;
    this.messagedata.RecipientRole = this.PrognosisForm.get("RecipientRole").value;
    this.messagedata.Precedence = this.PrognosisForm.get("Precedence").value;
    this.messagedata.ValidUntil = this.PrognosisForm.get("ValidUntil").value;

    console.log(this.XmlReq.TestMessage(this.messagedata));
  
  };

  handleDropDown(str: string ,event: any) {
    this.PrognosisForm.get(str).setValue(event.target.value);
  };

  handleDropDownProg(str: string ,event: any) {
    this.PrognosisForm.get(str).setValue(event.target.value);
    if (event.target.value == "D-Prognosis"){
      this.showCongestionPoint= true;
    }else{
      this.showCongestionPoint= false;
    }
  };

  public animateInfo(controller, transitionName: string = 'slide down', id) {
    this.activeModel = id;
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
  }

}
