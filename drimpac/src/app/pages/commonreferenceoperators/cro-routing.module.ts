import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CroComponent } from './cro.component';
import { CroAddComponent } from './cro-add/cro-add.component';
import { CroDeleteComponent } from './cro-delete/cro-delete.component';
//import { UnitEditComponent } from './unit-edit/unit-edit.component';
//import { UnitDeleteComponent } from './unit-delete/unit-delete.component';
//import { UnitAvailableComponent } from './unit-available/unit-available.component';

const routes: Routes = [{
  path: '',
  component: CroComponent,
  children: [
    {
      path: 'cro-add',
      component: CroAddComponent,
    },
 //   {
  //    path: 'unit-edit',
  //    component: UnitEditComponent,
  //  },
    {
      path: 'cro-delete',
      component: CroDeleteComponent,
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
export class CroRoutingModule { }
