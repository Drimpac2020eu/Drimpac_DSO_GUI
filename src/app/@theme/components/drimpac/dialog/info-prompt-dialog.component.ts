
import { NbDialogRef } from '@nebular/theme';
import { Component, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'nb-info-prompt',
  template: `
    <nb-card accent="primary">
      <nb-card-header>{{title}}</nb-card-header>
      <nb-card-footer>
        <div class="row" [ngStyle]="{'display': 'flex','justify-content': 'center'}">
                <button nbButton hero status="info" (click)="submit()">OK</button>
        </div>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [`./dialog-common.scss`],
})
export class DialogInfoPromptComponent {
  title;
  constructor(protected dialogRef: NbDialogRef<DialogInfoPromptComponent>) {
  }

  submit() {
    this.dialogRef.close();
  }
}
