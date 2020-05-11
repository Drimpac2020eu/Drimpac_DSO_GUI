import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbActionsModule, NbButtonModule, NbCardModule, NbDialogModule, NbSpinnerModule ,NbPopoverModule} from '@nebular/theme';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { SuiModule } from 'ng2-semantic-ui';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { CongestionAddComponent } from './congestion-add/congestion-add.component';
import { CongestionDeleteComponent } from './congestion-delete/congestion-delete.component';
import { DrmscongestionComponent } from './drmscongestion/drmscongestion.component';
//import { DialogDeleteComponent } from './unit-delete/dialog-delete.component';
//import { UnitDeleteComponent } from './unit-delete/unit-delete.component';
//import { UnitEditComponent } from './unit-edit/unit-edit.component';
//import { UnitAvailableComponent } from './unit-available/unit-available.component';
//import { UnitModelsComponent } from './unit-edit/unit-models.component';
import { CongestionRoutingModule } from './congestion-routing.module';
import { CongestionComponent } from './congestion.component';
import { Ng2SmartTableModule } from '@mykeels/ng2-smart-table';

const COMPONENTS = [
  CongestionComponent,
  CongestionAddComponent,
  CongestionDeleteComponent,
  DrmscongestionComponent,
  //UnitEditComponent,
  //UnitDeleteComponent,
  //UnitAvailableComponent,
  //UnitModelsComponent,
  //DialogDeleteComponent,
];

const ENTRY_COMPONENTS = [
  CongestionComponent,
  //DialogDeleteComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    CongestionRoutingModule,
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
    NbPopoverModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class CongestionModule { }
