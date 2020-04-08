import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { registerCroService } from '../../../@theme/services/croservices/registerCro.service';
import { GetAreaGridsService } from '../../../@theme/services/unit-management-services/get-area-grids.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { LocalDataSource } from '@mykeels/ng2-smart-table';
import { iConnection } from '../../../@theme/services/xmlRequests/xmlposts.service';
import { iCongestion } from '../../../@theme/services/xmlRequests/xmlposts.service';
import { XmlRequests } from '../../../@theme/services/xmlRequests/xmlposts.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NbDialogService, NbDialogConfig } from '@nebular/theme';
import { DialogInfoPromptComponent } from '../../../@theme/components';
import { DialogSubmitPromptComponent } from '../../../@theme/components/dialogs/dialog-submit.component';

@Component({
  selector: 'ngx-congestion-add',
  styleUrls: ['./congestion-add.component.scss'],
  providers: [XmlRequests,
    GetAreaGridsService, XmlRequests],
  templateUrl: './congestion-add.component.html',
})



export class CongestionAddComponent implements OnInit {

  message: string;
  activeModel: string = '1';
  transitionController = new TransitionController();
  CongestionPoint: string;
  CongestionForm: FormGroup;
  unamePattern = "ea1\\.[0-9]{4}-[0-9]{2}\\..{1,244}:.{1,244}";
  tmp: any;

  userSettings = {
    add: {
      addButtonContent: '<i class="nb-plus-circled"></i>',
      createButtonContent: '<i class="nb-plus"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      Connection: {
        title: 'Connection',
        width: '90%',
      },
    },
  };

  userSource: LocalDataSource = new LocalDataSource();

  @Output() select: EventEmitter<number> = new EventEmitter();

  constructor(private xmlRequests: XmlRequests, private dialogService: NbDialogService) {
  }

  ngOnInit() {
    this.CongestionForm = new FormGroup({
      'CongestionPoint': new FormControl(null, Validators.pattern(this.unamePattern)),
    });

  }

  public animateInfo(controller, transitionName: string = 'slide down', id) {
    this.activeModel = id;
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
  }

  ;

  handleClick() {
    if (this.CongestionForm.invalid || this.CongestionForm.get('CongestionPoint').value === "" || this.CongestionForm.get('CongestionPoint').value === null) {
      const context: Object = {
        context: {
          title: 'Congestion Point Pattern is Invalid!',
        },
      } as Partial<NbDialogConfig<string | Partial<DialogInfoPromptComponent>>>;
      this.dialogService.open(DialogInfoPromptComponent, context)
        .onClose.subscribe();

      return;
    }



    let tmp = Array<iConnection>(this.userSource['data'].length);
    for (let i = 0; i < this.userSource['data'].length; i++) {
      let str = "ean.";
      for (let y = this.userSource['data'][i]['Connection'].length; y < 12; y++) {
        str += "0";
      }
      tmp[i] = { entityAddress: str + this.userSource['data'][i]['Connection'] }
    }

    let temp = Array<iCongestion>();
    temp.push({ method: 'POST', entityAddress: this.CongestionForm.get('CongestionPoint').value, connections: tmp });


    this.xmlRequests.addNewCongestion(temp)
      .then(results => {
        this.message = JSON.stringify(results);
      });
  }

  onCreateConfirm(event) {
    const context: Object = {
      context: {
        title: 'Are you sure you Want to Add this Connection?',
      },
    } as Partial<NbDialogConfig<string | Partial<DialogSubmitPromptComponent>>>;
    this.dialogService.open(DialogSubmitPromptComponent, context)
      .onClose.subscribe(value => {
        if (value) {
          const regexp = new RegExp("[0-9]{1,34}");

          if (regexp.test(event.newData['Connection'])) {
            event.confirm.resolve();
          } else {
            const context2: Object = {
              context: {
                title: 'The Connection value pattern is not valid!',
              },
            } as Partial<NbDialogConfig<string | Partial<DialogInfoPromptComponent>>>;
            this.dialogService.open(DialogInfoPromptComponent, context2)
              .onClose.subscribe();
            event.confirm.reject();
          }


        } else {
          event.confirm.reject();
        }
      });
  }



  onDeleteConfirm(event): void {
    const context: Object = {
      context: {
        title: 'Are you sure you Want to Delete this Connection?',
      },
    } as Partial<NbDialogConfig<string | Partial<DialogSubmitPromptComponent>>>;
    this.dialogService.open(DialogSubmitPromptComponent, context)
      .onClose.subscribe(value => {
        if (value) {
          event.confirm.resolve();
        } else {
          event.confirm.reject();
        }
      });
  }

  onSaveConfirm(event) {

    const regexp = new RegExp("[0-9]{12,34}");
    if (regexp.test(event.newData['Connection'])) {
      event.confirm.resolve();
    } else {
      const context: Object = {
        context: {
          title: 'The Connection value pattern is not valid!',
        },
      } as Partial<NbDialogConfig<string | Partial<DialogInfoPromptComponent>>>;
      this.dialogService.open(DialogInfoPromptComponent, context)
        .onClose.subscribe();
      event.confirm.reject();
    }
  }

}
