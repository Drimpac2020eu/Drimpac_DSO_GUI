import { Component, OnInit } from '@angular/core';
import { GetDsoPremises } from '../../@theme/services/dsoPremises/getDsoPremises.service';
import { LocalDataSource } from '@mykeels/ng2-smart-table';

@Component({
  selector: 'ngx-events',
  styleUrls: ['./events.component.scss'],
  providers: [GetDsoPremises],
  templateUrl: './events.component.html',
})
export class EventsComponent implements OnInit {

  messages: any;
  messageQueue = [];

  userSettings = {
    actions: false,
    hideSubHeader: true,
        columns: {
          id: {
            title: 'id',
            width: '5%',
          },
          message: {
            title: 'Message',
          },
          data: {
            title: 'Data',
          },
          timestamp: {
            title: 'Timestamp',
            width: '15%',
          },
        },
      };

   userSource: LocalDataSource = new LocalDataSource();

  constructor(private getDsoPremises: GetDsoPremises) {

    this.getDsoPremises.getPremises()
    .then(events => {
      this.messages = new Array();
      this.messages = events['results'];
      console.log(this.messages);
      for (let i = 0; i < this.messages.length; i++) {
        this.messageQueue[i] = {
         id: [i + 1], message: [this.messages[i]['payload']['message']], timestamp : [this.messages[i]['payload']['timestamp']],data : [this.messages[i]['payload']['data']]
        };
      }

      this.userSource.load(this.messageQueue);
      });
    }

  ngOnInit() {
  }

}
