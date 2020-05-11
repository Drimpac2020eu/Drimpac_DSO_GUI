import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CreateDeviceService } from '../../../@theme/services/unit-management-services/create-device.service';
import { GetAreaGridsService } from '../../../@theme/services/unit-management-services/get-area-grids.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-unit-add',
  styleUrls: ['./unit-add.component.scss'],
  providers: [CreateDeviceService,
    GetAreaGridsService],
  templateUrl: './unit-add.component.html',
})
export class UnitAddComponent implements OnInit {
  unitName: string;
  unitIP: string;
  unitPort: string;
  unitDescr: string;
  message: string;
  activeModel: string = '1';
  transitionController = new TransitionController();
  AggregatorForm: FormGroup;

  @Output() select: EventEmitter<number> = new EventEmitter();

  constructor(private createDeviceService: CreateDeviceService) {
  }

  ngOnInit() {

    this.AggregatorForm = new FormGroup({
      'unit_Name': new FormControl(null),
      'unit_Description': new FormControl(null),
      'unit_IP': new FormControl(null),
      'unit_REST': new FormControl(null),
    });
  }

  public animateInfo(controller, transitionName: string = 'slide down', id) {
    this.activeModel = id;
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
  }



  handleClick() {
    this.unitName = this.AggregatorForm.get('unit_Name').value;
    this.unitIP = this.AggregatorForm.get('unit_IP').value;
    this.unitDescr = this.AggregatorForm.get('unit_Description').value;
    this.unitPort = this.AggregatorForm.get('unit_REST').value;

    this.createDeviceService.createNewDevice( this.unitName, this.unitDescr, this.unitIP, this.unitPort)
      .then(results => {
        this.message = JSON.stringify(results);
      });
  }

}
