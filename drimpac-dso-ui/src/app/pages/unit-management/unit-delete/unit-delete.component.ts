import { Component, OnInit } from '@angular/core';
import { GetDeviceByTypeService } from '../../../@theme/services/unit-management-services/get-deviceByType.service';
import { DeleteDeviceService } from '../../../@theme/services/unit-management-services/delete-device.service';
import { NbDialogService } from '@nebular/theme';
import { DialogDeleteComponent } from './dialog-delete.component';

@Component({
  selector: 'ngx-unit-delete',
  styleUrls: ['./unit-delete.component.scss'],
  providers: [DeleteDeviceService,
    GetDeviceByTypeService],
  templateUrl: './unit-delete.component.html',
})
export class UnitDeleteComponent implements OnInit {
  unitName: string;
  message: string;
  agrregators: any;
  phase: string;
  loading: boolean = false;
  selectedModel;

  constructor(private getDeviceByType: GetDeviceByTypeService,
    private deleteDevice: DeleteDeviceService,
    private dialogService: NbDialogService) {
    this.getDeviceByType.getDeviceByType()
    .then(devices => {
      this.agrregators = new Array();
      this.agrregators = devices['results'];
    });
  }

  ngOnInit() {
    this.phase = '1';
  }

  handleSelectedModel(string) {
    this.unitName = string;
    this.dialogService.open(DialogDeleteComponent)
      .onClose.subscribe(value => {
        this.message = '';
        if (value) {
          this.deleteDevice.deleteDevice(this.unitName)
            .then(results => {
              this.message = JSON.stringify(results);
              this.getDeviceByType.getDeviceByType()
              .then(devices => {
                this.agrregators = devices['results'];
              });
            });
        }
      });
  }

}
