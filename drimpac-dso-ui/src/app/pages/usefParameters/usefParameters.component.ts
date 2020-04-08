import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { XmlRequests } from '../../@theme/services/xmlRequests/xmlposts.service';
import { iflex } from '../../@theme/services/xmlRequests/xmlposts.service';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as momenttz from 'moment-timezone';
import { ɵNgStyleR2Impl } from '@angular/common';
import { NbDialogService, NbDialogConfig } from '@nebular/theme';
import { DialogInfoPromptComponent } from '../../@theme/components';
import { DialogSubmitPromptComponent } from '../../@theme/components/dialogs/dialog-submit.component';
import * as codes from 'currency-codes';


@Component({
  selector: 'ngx-usef',
  styleUrls: ['./usefParameters.component.scss'],
  providers: [XmlRequests],
  templateUrl: './usefParameters.component.html',
})
export class UsefParametersComponent implements OnInit {

  Form: FormGroup;
  timeZones: string[];
  valueTM: any;
  tempValues: any;

  currencycodes: string[];

  constructor(private XmlReq: XmlRequests, private dialogService: NbDialogService) {
    this.tempValues = new Array();
    this.Form = new FormGroup({
      'COMMON REFERENCE UPDATE TIME': new FormControl(null),
      'INITIALIZE PLANBOARD TIME': new FormControl(null),
      'CONNECTION FORECAST TIME': new FormControl(null),
      'PTU DURATION': new FormControl(null),
      'TimeZone': new FormControl(null),
      'CURRENCY': new FormControl(null),
      'BYPASS SCHEDULED EVENTS': new FormControl(null),
    });




    //this.Form = this.
  }

  ngOnInit() {


    this.XmlReq.getusefProperty(["DSO_COMMON_REFERENCE_UPDATE_TIME"]).then(results => {
      console.log(results);
      this.tempValues['COMMON REFERENCE UPDATE TIME'] = results['data'];
      this.Form.get("COMMON REFERENCE UPDATE TIME").setValue(results['data']);
    });

    this.XmlReq.getusefProperty(["DSO_INITIALIZE_PLANBOARD_TIME"]).then(results => {
      this.tempValues['INITIALIZE PLANBOARD TIME'] = results['data'];
      this.Form.get("INITIALIZE PLANBOARD TIME").setValue(results['data']);
      console.log(results);
    });

    this.XmlReq.getusefProperty(["DSO_CONNECTION_FORECAST_TIME"]).then(results => {
      this.tempValues['CONNECTION FORECAST TIME'] = results['data'];
      this.Form.get("CONNECTION FORECAST TIME").setValue(results['data']);
      console.log(results);
    });

    this.XmlReq.getusefProperty(["PTU_DURATION"]).then(results => {
      this.tempValues['PTU DURATION'] = results['data'];
      this.Form.get("PTU DURATION").setValue(results['data']);
      console.log(results);
    });

    this.XmlReq.getusefProperty(["TIME_ZONE"]).then(results => {
      // 
      this.tempValues['TimeZone'] = results['data'];
      this.valueTM = results['data'];
      // console.log);
      this.timeZones = momenttz.tz.names();
      console.log(this.valueTM);
      this.Form.controls['TimeZone'].setValue(results['data'], { onlySelf: true });
    });

    this.XmlReq.getusefProperty(["BYPASS_SCHEDULED_EVENTS"]).then(results => {
      this.tempValues['BYPASS SCHEDULED EVENTS'] = results['data'];
      this.Form.controls['BYPASS SCHEDULED EVENTS'].setValue(results['data'], { onlySelf: true });
      console.log(results);
    });

    this.XmlReq.getusefProperty(["CURRENCY"]).then(results => {
      this.tempValues['CURRENCY'] = results['data'];
      this.currencycodes = codes.codes();
      this.Form.controls['CURRENCY'].setValue(results['data'], { onlySelf: true });
      console.log(results);
    });




  }

  handleDropDown2(str: string, event: any) {

  };

  public animateInfo(controller, transitionName: string = 'slide down', id) {

  }


  regextest(str: string, str2: string) {
    const regexp = new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$");
    if (regexp.test(this.Form.get(str).value)) {
      return true;
    } else {
      const context: Object = {
        context: {
          title: str2,
        },
      } as Partial<NbDialogConfig<string | Partial<DialogInfoPromptComponent>>>;
      this.dialogService.open(DialogInfoPromptComponent, context)
        .onClose.subscribe();
      return false;
    }
  }

  regextestn(str: string, str2: string) {
    const regexp = new RegExp("^[0-9]*$");
    if (regexp.test(this.Form.get(str).value)) {
      return true;
    } else {
      const context: Object = {
        context: {
          title: str2,
        },
      } as Partial<NbDialogConfig<string | Partial<DialogInfoPromptComponent>>>;
      this.dialogService.open(DialogInfoPromptComponent, context)
        .onClose.subscribe();
      return false;
    }
  }

  handleClick() {

    if (this.Form.get("COMMON REFERENCE UPDATE TIME").value !== this.tempValues["COMMON REFERENCE UPDATE TIME"]) {
      if (this.regextest("COMMON REFERENCE UPDATE TIME", "Common Reference Update Time pattern is not valid") === true) {
        this.XmlReq.setusefProperty(["DSO_COMMON_REFERENCE_UPDATE_TIME", this.Form.get("COMMON REFERENCE UPDATE TIME").value]);
      }

    }

    if (this.Form.get("INITIALIZE PLANBOARD TIME").value !== this.tempValues["INITIALIZE PLANBOARD TIME"]) {
      if (this.regextest("INITIALIZE PLANBOARD TIME", "Initialize Planboard Time pattern is not valid") === true) {
        this.XmlReq.setusefProperty(["DSO_INITIALIZE_PLANBOARD_TIME", this.Form.get("INITIALIZE PLANBOARD TIME").value]);
      }
    }

    if (this.Form.get("CONNECTION FORECAST TIME").value !== this.tempValues["CONNECTION FORECAST TIME"]) {
      if (this.regextest("CONNECTION FORECAST TIME", "Connection Forecast Time pattern is not valid") === true) {
        this.XmlReq.setusefProperty(["DSO_CONNECTION_FORECAST_TIME", this.Form.get("CONNECTION FORECAST TIME").value]);
      }
    }

    if (this.Form.get("PTU DURATION").value !== this.tempValues["PTU DURATION"]) {
      if (this.regextestn("PTU DURATION", "Not valid PTU duration") === true) {
        this.XmlReq.setusefProperty(["PTU_DURATION", this.Form.get("PTU DURATION").value]);
      }
    }

    if (this.Form.get("TimeZone").value !== this.tempValues["TimeZone"]) {
      this.XmlReq.setusefProperty(["TIME_ZONE", this.Form.get("TimeZone").value]);
    }

    if (this.Form.get("BYPASS SCHEDULED EVENTS").value !== this.tempValues["BYPASS SCHEDULED EVENTS"]) {
      this.XmlReq.setusefProperty(["BYPASS_SCHEDULED_EVENTS", this.Form.get("BYPASS SCHEDULED EVENTS").value]);
    }

    if (this.Form.get("CURRENCY").value !== this.tempValues["CURRENCY"]) {
      this.XmlReq.setusefProperty(["CURRENCY", this.Form.get("CURRENCY").value]);
    }


  };


  handleDropDown(str: string, event: any) {
    console.log(str);
    console.log(event.target.value);
    this.Form.get(str).setValue(event.target.value);
  };

}
