import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserAdministrationComponent } from './user-administration/user-administration.component';
import { PagesComponent } from './pages.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { EventsComponent} from './events/events.component';
import { FlexRequestComponent} from './flexRequest/flexRequest.component';
import { UsefParametersComponent} from './usefParameters/usefParameters.component';
import { ActiveCongestionsComponent} from './activecongestions/activecongestions.component';
import { ActiveAggregatorsComponent} from './activeaggregators/activeaggregators.component';
import { ConfigFileComponent} from './configfile/configFile.component';
import { FlexOrderComponent} from './flexOrder/flexOrder.component';
import { FlexOfferRevokeComponent} from './flexOfferRevoke/flexOfferRevoke.component';
import { TestMessageComponent} from './testmessage/testmessage.component';
import { CongetionConectionPointsComponent} from './points/CongetionConectionPoints.component';
import { PrognosisComponent} from './prognosis/prognosis.component';
import { CommandsComponent} from './commands/commands.component';



const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: 'unit-management',
      loadChildren: () => import('./unit-management/unit-management.module')
        .then(m => m.UnitManagementModule),
  },
  {
    path: 'congestionpoints',
    loadChildren: () => import('./congestionpoints/congestion.module')
      .then(m => m.CongestionModule),
},
{
  path: 'commonreferenceoperators',
  loadChildren: () => import('./commonreferenceoperators/cro.module')
    .then(m => m.CroModule),
}, {
    path: 'user-profile',
    component: UserProfileComponent,
  }, {
    path: 'user-administration',
    component: UserAdministrationComponent,
  }, {
      path: 'welcome-screen',
      component: WelcomeScreenComponent,
    },  {
      path: 'events',
      component: EventsComponent,
    }, 
    {
      path: 'flexRequest',
      component: FlexRequestComponent,
    },
    {
      path: 'usefParameters',
      component: UsefParametersComponent,
    },
    {
      path: 'activecongestions',
      component: ActiveCongestionsComponent,
    },
    {
      path: 'activeaggregators',
      component: ActiveAggregatorsComponent,
    },
    {
      path: 'configfile',
      component: ConfigFileComponent,
    },
    {
      path: 'flexOrder',
      component: FlexOrderComponent,
      data : {mode : 'Pending Flexibillity Offers'},
    },
    {
      path: 'flexOrder2',
      component: FlexOrderComponent,
      data : {mode : 'Rejected Flexibillity Offers'},
    },
    {
      path: 'flexOrder3',
      component: FlexOrderComponent,
      data : {mode : 'Revoked Flexibillity Offers'},
    },  {
      path: 'flexOfferRevoke',
      component: FlexOfferRevokeComponent,
    },
    {
      path: 'testmessage',
      component: TestMessageComponent,
    },
    {
      path: 'points',
      component: CongetionConectionPointsComponent,
    },
    {
      path: 'prognosis',
      component: PrognosisComponent,
    },
    {
      path: 'commands',
      component: CommandsComponent,
    },{
    path: '**',
    component: NotFoundComponent,
  },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
