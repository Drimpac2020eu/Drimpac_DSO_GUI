import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbCardModule,
  NbMenuModule,
  NbPopoverModule,
  NbUserModule,
  NbIconModule,
  NbListModule,
  NbSelectModule,
  NbButtonModule,
  NbDatepickerModule,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserAdministrationComponent } from './user-administration/user-administration.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
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
import { Ng2SmartTableModule } from '@mykeels/ng2-smart-table';
import { UserAdminPictureComponent } from './user-administration/user-admin-picture/user-admin-picture.component';
import { UserAdminRoleComponent } from './user-administration/user-admin-role/user-admin-role.component';
import { UserAvailablePictureComponent } from './unit-management/unit-available/user-available-picture/user-available-picture.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbUserModule,
    NbIconModule,
    NbListModule,
    NbSelectModule,
    NbButtonModule,
    NbCardModule,
    MiscellaneousModule,
    FormsModule,
    ReactiveFormsModule,
    NbDatepickerModule,
    Ng2SmartTableModule,
    NgxChartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NbPopoverModule,
  ],
  declarations: [
    PagesComponent,
    UserProfileComponent,
    WelcomeScreenComponent,
    UserAdministrationComponent,
    EventsComponent,
    FlexRequestComponent,
    UsefParametersComponent,
    ActiveCongestionsComponent,
    ActiveAggregatorsComponent,
    ConfigFileComponent,
    FlexOrderComponent,
    FlexOfferRevokeComponent,
    TestMessageComponent,
    CongetionConectionPointsComponent,
    PrognosisComponent,
    CommandsComponent,
    UserAdminPictureComponent,
    UserAvailablePictureComponent,
    UserAdminRoleComponent,
  ],
  entryComponents: [
    UserAdminPictureComponent,
    UserAvailablePictureComponent,
    UserAdminRoleComponent,
  ],
})
export class PagesModule {
}
