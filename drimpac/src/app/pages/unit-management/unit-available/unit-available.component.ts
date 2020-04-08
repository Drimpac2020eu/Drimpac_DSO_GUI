import { Component, OnInit } from '@angular/core';
import { GetAvailiableAggregators } from '../../../@theme/services/getAvailiableAggregators/getAvailiableAggregators.service';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import { UserAvailablePictureComponent } from './user-available-picture/user-available-picture.component';

@Component({
  selector: 'ngx-available',
  styleUrls: ['./unit-available.component.scss'],
  providers: [GetAvailiableAggregators],
  templateUrl: './unit-available.component.html',
})
export class UnitAvailableComponent implements OnInit {

  messages: any;
 // messageQueue = [];
  messageQueue = Object;

  userSettings = {
    actions: false,
    hideSubHeader: true,
        columns: {
       //   id: {
       //     title: 'id',
       //     width: '5%',
       //   },
          Name: {
            title: 'Name',
            type: 'custom',
            renderComponent: UserAvailablePictureComponent,
          },
          Email: {
            title: 'Email',
          },
          Country: {
            title: 'Country',
            width: '25%',
          },
        },
      };

   userSource: LocalDataSource = new LocalDataSource();

  constructor(private getDsoPremises: GetAvailiableAggregators) {

    this.getDsoPremises.getPremises()
    .then(events => {
      this.messageQueue = events['userList'];
      this.userSource.load(events['userList']);
console.log(events['userList']);
    //  this.messages = new Array();
    //  this.messages = events['results'];
    //  for (let i = 0; i < this.messages.length; i++) {
    //    this.messageQueue[i] = {
    //     id: [i + 1], message: [this.messages[i]['payload']['message']], timestamp : [this.messages[i]['payload']['timestamp']],
    //    };
    //  }

    //  this.userSource.load(this.messageQueue);
      });
    }

  ngOnInit() {
  }

}
