import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { registerCroService } from '../../../@theme/services/croservices/registerCro.service';
import { deleteCroService } from '../../../@theme/services/croservices/deleteCro.service';
import { GetAreaGridsService } from '../../../@theme/services/unit-management-services/get-area-grids.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import {iCRO} from '../../../@theme/services/xmlRequests/xmlposts.service';
import { XmlRequests } from '../../../@theme/services/xmlRequests/xmlposts.service';

@Component({
  selector: 'ngx-cro-delete',
  styleUrls: ['./cro-delete.component.scss'],
  providers: [registerCroService,
    GetAreaGridsService,XmlRequests],
  templateUrl: './cro-delete.component.html',
})



export class CroDeleteComponent implements OnInit {
 
  message: string;
  activeModel: string = '1';
  transitionController = new TransitionController();

  messages: any;
  messageQueue = [];

  tmp: any;

  userSettings = {
    hideSubHeader: true,
    add:{
      addButtonContent: '<i class="nb-plus-circled"></i>',
      createButtonContent: '<i class="nb-plus"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    actions:{
    edit: false,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
     
    },
        columns: {
          CRO: {
            title: 'Common Reference Operator',
            width: '90%',
          },
        },
      };

  userSource: LocalDataSource = new LocalDataSource();
  userSourceCopy: LocalDataSource = new LocalDataSource();

  @Output() select: EventEmitter<number> = new EventEmitter();

  constructor(private createCROService: registerCroService,private deleteCROService: XmlRequests) {

    console.log("getCRO"); 
    this.deleteCROService.getCROs()
    .then(events => {  
      this.messages = new Array();
      this.messages = JSON.parse(events['body']);
      console.log(JSON.parse(events['body']));
      for (let i = 0; i <this.messages.length; i++)
      {
        this.messageQueue[i] = {CRO: [this.messages[i]['domain']],
        };
      }

      this.userSource.load(this.messageQueue);
      });
  }
  

  ngOnInit() {

    
  }

  public animateInfo(controller, transitionName: string = 'slide down', id) {
    this.activeModel = id;
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
  }

temp: any;
  
  handleClick() {
    let tmp = Array<iCRO>();
    for (let i=0; i<this.messageQueue.length; i++)
    {
      let index = true;
      for (let y = 0; y <this.userSource['data'].length; y++)
      {
        if (this.messageQueue[i]['CRO'][0].localeCompare(this.userSource['data'][y]['CRO'][0])==0)
        {        
          index=false; 
        }      
      } 
      if (index)
      {
        tmp.push({method: 'DELETE', domain: this.messageQueue[i]['CRO'][0]});
      }    
    }
    console.log(tmp);
    this.createCROService.addNewCro( tmp)
      .then(results => {
        this.message = JSON.stringify(results);
   });
  }

  onDeleteConfirm(event): void {
   console.log(event);
  }
}
