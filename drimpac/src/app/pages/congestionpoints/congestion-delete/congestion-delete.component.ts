import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { registerCroService } from '../../../@theme/services/croservices/registerCro.service';
import { GetAreaGridsService } from '../../../@theme/services/unit-management-services/get-area-grids.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import {iCongestionDel} from '../../../@theme/services/xmlRequests/xmlposts.service';
import { XmlRequests } from '../../../@theme/services/xmlRequests/xmlposts.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-congestion-delete',
  styleUrls: ['./congestion-delete.component.scss'],
  providers: [registerCroService,
    GetAreaGridsService,XmlRequests],
  templateUrl: './congestion-delete.component.html',
})



export class CongestionDeleteComponent implements OnInit {
 
  message: string;
  activeModel: string = '1';
  transitionController = new TransitionController();

  messages: any;
  messageQueue: any;
  CongestionForm: FormGroup;

  tmp: any;
  table= [];
  entinities: any;
  entinityval:any;
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
            title: 'Connection',
            width: '90%',
          },
        },
      };

  userSource: LocalDataSource = new LocalDataSource();
  userSourceCopy: LocalDataSource = new LocalDataSource();

  @Output() select: EventEmitter<number> = new EventEmitter();

  constructor(private createCROService: registerCroService,private XmlReq: XmlRequests) {

    this.XmlReq.getSynchronisationCongestionpoints().then(
      events => {
       // this.messageQueue = new Array<Object>;
        this.messageQueue = JSON.parse(events['body']);
        let list =new Array();
        for (let i = 0; i <this.messageQueue.length; i++)
        {
          list.push(this.messageQueue[i]['entityAddress']);
        }
        this.entinities = list;
      });
  }
  

  ngOnInit() {
    this.CongestionForm = new FormGroup({
      'CongestionPoint': new FormControl(null),
    });
    
  }

  public animateInfo(controller, transitionName: string = 'slide down', id) {
    this.activeModel = id;
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
  }

temp: any;
  
  handleClick() {
    let temp  =Array<iCongestionDel>();
    temp.push({method: 'DELETE', entityAddress: this.entinityval});
console.log(temp);
    this.XmlReq.addNewCongestion( temp)
      .then(results => {
        this.message = JSON.stringify(results);
   });
  }

  onDeleteConfirm(event): void {
   console.log(event);
  }

  handleDropDown(event: any) {

    this.entinityval=event.target.value;
    this.table=[];
    for (let i = 0; i <this.messageQueue.length; i++)
    {
      if (event.target.value === this.messageQueue[i]['entityAddress'])
      {
        for (let y = 0; y <this.messageQueue[i]['connections'].length; y++)
        {
          console.log(this.messageQueue[i]['connections'][y]['entityAddress']);

          let str=this.messageQueue[i]['connections'][y]['entityAddress'];
          str=str.substring(4);
          while(str[0]==='0')
          {
            str=str.substring(1);
          }
          this.table.push( {CRO: [str],
          });
        //  this.table.push( {CRO: [this.messageQueue[i]['connections'][y]['entityAddress']],
        //  });
        }
      }
      
    }
    this.userSource.load(this.table);
  };
}
