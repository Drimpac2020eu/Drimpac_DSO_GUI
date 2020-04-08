import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbActionsModule, NbButtonModule, NbCardModule, NbDialogModule, NbSpinnerModule } from '@nebular/theme';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { SuiModule } from 'ng2-semantic-ui';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { CroAddComponent } from './cro-add/cro-add.component';
import { CroDeleteComponent } from './cro-delete/cro-delete.component';
//import { DialogDeleteComponent } from './unit-delete/dialog-delete.component';
//import { UnitDeleteComponent } from './unit-delete/unit-delete.component';
//import { UnitEditComponent } from './unit-edit/unit-edit.component';
//import { UnitAvailableComponent } from './unit-available/unit-available.component';
//import { UnitModelsComponent } from './unit-edit/unit-models.component';
import { CroRoutingModule } from './cro-routing.module';
import { CroComponent } from './cro.component';
import { Ng2SmartTableModule } from '@mykeels/ng2-smart-table';

const COMPONENTS = [
  CroComponent,
  CroAddComponent,
  CroDeleteComponent,
  //UnitEditComponent,
  //UnitDeleteComponent,
  //UnitAvailableComponent,
  //UnitModelsComponent,
  //DialogDeleteComponent,
];

const ENTRY_COMPONENTS = [
  CroComponent,
  //DialogDeleteComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    CroRoutingModule,
    NbButtonModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbActionsModule,
    NbSpinnerModule,
    NbDialogModule.forRoot(),
    HttpClientModule,
    NgxChartsModule,
    ChartModule,
    NgxEchartsModule,
    SuiModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class CroModule { }
