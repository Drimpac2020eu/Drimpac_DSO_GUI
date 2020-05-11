import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { registerCroService } from '../../../@theme/services/croservices/registerCro.service';
import { GetAreaGridsService } from '../../../@theme/services/unit-management-services/get-area-grids.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import {iCRO} from '../../../@theme/services/xmlRequests/xmlposts.service';
import { XmlRequests } from '../../../@theme/services/xmlRequests/xmlposts.service';

@Component({
  selector: 'ngx-cro-add',
  styleUrls: ['./cro-add.component.scss'],
  providers: [registerCroService,
    GetAreaGridsService,XmlRequests],
  templateUrl: './cro-add.component.html',
})



export class CroAddComponent implements OnInit {
 
  message: string;
  activeModel: string = '1';
  transitionController = new TransitionController();

  tmp: any;

  userSettings = {
    add:{
      addButtonContent: '<i class="nb-plus-circled"></i>',
      createButtonContent: '<i class="nb-plus"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      
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

  @Output() select: EventEmitter<number> = new EventEmitter();

  constructor(private createCROService: registerCroService) {
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
    let tmp = Array<iCRO>(this.userSource['data'].length);
    for (let i=0; i<this.userSource['data'].length; i++)
    {
      tmp[i]={method: 'POST', domain: this.userSource['data'][i]['CRO']}
    }

    this.createCROService.addNewCro( tmp)
      .then(results => {
        this.message = JSON.stringify(results);
   });
  }

}
