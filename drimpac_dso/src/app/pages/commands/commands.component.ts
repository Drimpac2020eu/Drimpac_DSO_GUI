import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { XmlRequests } from '../../@theme/services/xmlRequests/xmlposts.service';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as momenttz from 'moment-timezone';
import { IMessageMetadata } from '../../@theme/services/xmlRequests/xmlposts.service';
//import { AnyTxtRecord } from 'dns';

@Component({
  selector: 'ngx-usef',
  styleUrls: ['./commands.component.scss'],
  providers: [XmlRequests],
  templateUrl: './commands.component.html',
})
export class CommandsComponent implements OnInit {

  message: string;
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

    this.messagedata = {
      SenderDomain: null, SenderRole: null, RecipientDomain: null, RecipientRole: null,
      Precedence: null, ValidUntil: null
    };
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

  }

  handleClick() {


    console.log("update")
    this.XmlReq.CommonReferenceUpdateEvent().then(
      results => {
        this.message = JSON.stringify(results);
      });



  };

  handleClick2() {



    console.log("update")
    this.XmlReq.CommonReferenceQueryEvent().then(
      results => {
        this.message = JSON.stringify(results);
      });



  };

  handleClick3() {

    console.log("forecast")
    this.XmlReq.CreateConnectionForecastEvent().then(
      results => {
        this.message = JSON.stringify(results);
      });

  };

  handleDropDown(str: string, event: any) {
    this.PrognosisForm.get(str).setValue(event.target.value);
  };

  handleDropDownProg(str: string, event: any) {

  };

  public animateInfo(controller, transitionName: string = 'slide down', id) {
    this.activeModel = id;
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
  }

}
