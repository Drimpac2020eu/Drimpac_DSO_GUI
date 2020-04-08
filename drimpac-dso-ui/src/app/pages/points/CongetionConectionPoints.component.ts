import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { XmlRequests } from '../../@theme/services/xmlRequests/xmlposts.service';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import {IMessageMetadata} from '../../@theme/services/xmlRequests/xmlposts.service';

@Component({
  selector: 'ngx-usef',
  styleUrls: ['./CongetionConectionPoints.component.scss'],
  providers: [XmlRequests],
  templateUrl: './CongetionConectionPoints.component.html',
})
export class CongetionConectionPointsComponent implements OnInit {

  messageQueue = Object;
  messageQueue2 = Object;
  activeModel: string = '';
  transitionController = new TransitionController();
  TestMessForm: FormGroup;
  messagedata: IMessageMetadata;
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
    this.TestMessForm = new FormGroup({
      'CongestionPoint': new FormControl(null),
      'Connection': new FormControl(null),
      'SenderDomain': new FormControl(null),
      'SenderRole': new FormControl("DSO"),
      'RecipientDomain': new FormControl(null),
      'RecipientRole': new FormControl("CRO"),
      'Precedence': new FormControl("Critical"),
      'ValidUntil': new FormControl(null),
    });

    this.TestMessForm.get("ValidUntil").setValue(moment().format());

    
  }

  handleClick() {
    console.log(this.TestMessForm.get("SenderDomain").value);
    this.messagedata.SenderDomain = this.TestMessForm.get("SenderDomain").value;
    this.messagedata.SenderRole = this.TestMessForm.get("SenderRole").value;
    this.messagedata.RecipientDomain = this.TestMessForm.get("RecipientDomain").value;
    this.messagedata.RecipientRole = this.TestMessForm.get("RecipientRole").value;
    this.messagedata.Precedence = this.TestMessForm.get("Precedence").value;
    this.messagedata.ValidUntil = this.TestMessForm.get("ValidUntil").value;

    console.log(this.XmlReq.TestMessage(this.messagedata));
  
  };

  handleDropDown(str: string ,event: any) {
    this.TestMessForm.get(str).setValue(event.target.value);
  };

  public animateInfo(controller, transitionName: string = 'slide down', id) {
    this.activeModel = id;
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
  }

}
