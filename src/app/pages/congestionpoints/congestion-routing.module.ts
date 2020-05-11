import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CongestionComponent } from './congestion.component';
import { CongestionAddComponent } from './congestion-add/congestion-add.component';
import { CongestionDeleteComponent } from './congestion-delete/congestion-delete.component';
import { DrmscongestionComponent } from './drmscongestion/drmscongestion.component';
//import { UnitEditComponent } from './unit-edit/unit-edit.component';
//import { UnitDeleteComponent } from './unit-delete/unit-delete.component';
//import { UnitAvailableComponent } from './unit-available/unit-available.component';

const routes: Routes = [{
  path: '',
  component: CongestionComponent,
  children: [
    {
      path: 'congestion-add',
      component: CongestionAddComponent,
    },
    {
      path: 'drmscongestions',
      component: DrmscongestionComponent,
    },
    {
      path: 'congestion-delete',
      component: CongestionDeleteComponent,
    },
  //  {
   //   path: 'unit-available',
   //   component: UnitAvailableComponent,
   // },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CongestionRoutingModule { }
