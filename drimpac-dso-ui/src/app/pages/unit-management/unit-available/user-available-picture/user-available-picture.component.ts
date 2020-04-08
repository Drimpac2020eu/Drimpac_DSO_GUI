import { Component, Input } from '@angular/core';
import { ViewCell } from '@mykeels/ng2-smart-table';

@Component({
  selector: 'ngx-user-available-picture',
  template: `
  <div class="row">
  <div class="col-md-4"></div>
  <nb-user [picture]="rowData.image" [name]="rowData.Name"
    [title]="'Aggregator'" size="large"></nb-user>
    <div class="col-md-4"></div>
    </div>
  `,
  styleUrls: ['./user-available-picture.component.scss'],
})
export class UserAvailablePictureComponent implements ViewCell {

  constructor() { }

  @Input() value: any;    // This hold the cell value
  @Input() rowData: any;  // This holds the entire row object

  public getUserRole(role: string): string {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'user':
        return 'User';
      default:
        return 'Aggregator';
    }
  }

}
