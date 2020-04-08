import { Component, OnInit } from '@angular/core';
import { GetDeviceByTypeService } from '../../../@theme/services/unit-management-services/get-deviceByType.service';
import { EditDeviceService } from '../../../@theme/services/unit-management-services/edit-device.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-unit-edit',
  styleUrls: ['./unit-edit.component.scss'],
  providers: [GetDeviceByTypeService, EditDeviceService],
  templateUrl: './unit-edit.component.html',
})
export class UnitEditComponent implements OnInit {
  unitName: string;
  unitIP: string;
  unitPort: string;
  unitDescr: string;
  message: string;
  agrregators: any;
  phase: string;
  transitionController = new TransitionController();
    AggregatorForm: FormGroup;

  constructor(private getDeviceByType: GetDeviceByTypeService,
    private editDevice: EditDeviceService) {
    this.getDeviceByType.getDeviceByType()
    .then(devices => {
      this.agrregators = new Array();
      this.agrregators = devices['results'];
    });
  }

  ngOnInit() {
    this.phase = '1';

    this.AggregatorForm = new FormGroup({
      'unit_Name': new FormControl(null),
      'unit_Description': new FormControl(null),
      'unit_IP': new FormControl(null),
      'unit_REST': new FormControl(null),
    });
  }


  handleClick() {

    // tslint:disable-next-line: prefer-const
    let metadata: string;
    this.unitName = this.AggregatorForm.get('unit_Name').value;
    this.unitIP = this.AggregatorForm.get('unit_IP').value;
    this.unitDescr = this.AggregatorForm.get('unit_Description').value;
    this.unitPort = this.AggregatorForm.get('unit_REST').value;
    this.editDevice.editDevice(this.agrregators, metadata, this.unitName, this.unitDescr, this.unitIP, this.unitPort)
      .then(results => {
        this.message = JSON.stringify(results);
      });
  }

  handleSelectedModel2(name, ip, port, descr, controller, transitionName: string = 'fade down') {
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
    this.unitName = name;
    this.unitIP = ip;
    this.unitPort = port;
    this.unitDescr = descr;
    this.phase = '2';

    this.AggregatorForm.get('unit_Name').setValue(this.unitName);
    this.AggregatorForm.get('unit_IP').setValue(this.unitIP);
    this.AggregatorForm.get('unit_REST').setValue(this.unitPort);
    this.AggregatorForm.get('unit_Description').setValue(this.unitDescr);
  }

}
