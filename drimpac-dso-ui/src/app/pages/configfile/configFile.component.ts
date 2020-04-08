import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { XmlRequests } from '../../@theme/services/xmlRequests/xmlposts.service';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as momenttz from 'moment-timezone';

@Component({
  selector: 'ngx-usef',
  styleUrls: ['./configFile.component.scss'],
  providers: [XmlRequests],
  templateUrl: './configFile.component.html',
})
export class ConfigFileComponent implements OnInit {

 
table = [];


userSettings = {
  actions: false,
  hideSubHeader: true,
  add:{
    addButtonContent: '<i class="nb-plus-circled"></i>',
    createButtonContent: '<i class="nb-plus"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',
  },
 
  delete: {
    deleteButtonContent: '<i class="nb-trash"></i>',
   
  },
      columns: {
        type1: {
          title: 'Key',
          width: '50%',
        },
        type2: {
          title: 'Value',
        },
      },
    };


userSource: LocalDataSource = new LocalDataSource();


  @Output() select: EventEmitter<number> = new EventEmitter();

  constructor(private XmlReq: XmlRequests) {

    }

  ngOnInit() {
 
      this.XmlReq.getConfigFile().then(
        events => {
         // console.log(JSON.parse(events['body']));
         this.table=[];
          var tmp = JSON.parse(events['body']);
          for(let key in tmp) {
           
            if (key.substring(0, 4).localeCompare("agr_")!=0 && key.substring(0, 4).localeCompare("brp_")!=0 && key.localeCompare("nodes")!=0)
    
            this.table.push({type1: key, type2:  tmp[key]}, );

            }
            this.userSource.load(this.table);
        });
  }

 

  

  handleClick() {
    
  
  };

 

}
