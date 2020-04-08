import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  NbActionsModule,
  NbAlertModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbCheckboxModule,
  NbThemeModule,
  NbDialogModule,
  NbCardModule,
  NbInputModule,
  NbRadioModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';
import { MatSlideToggleModule } from '@angular/material';
import { SuiModule } from 'ng2-semantic-ui';
import { Ng2SmartTableModule } from '@mykeels/ng2-smart-table';
import { NgxEchartsModule } from 'ngx-echarts';


/* Auth Components */
import {
  NgxAuthBlockComponent,
  NgxAuthComponent,
  NgxRequestPasswordComponent,
  NgxSendResetRequestComponent,
  NgxResetPasswordComponent,
  NgxLoginComponent,
  NgxLogoutComponent,
  NgxCreateAccountComponent,
  NgxRegisterComponent,
} from './components';

import {
  DialogSubmitPromptComponent,
  LineChartComponent,
} from './components';

import {
  FooterComponent,
  HeaderComponent,
  SearchInputComponent,
  TinyMCEComponent,
} from './components';

import {
  DialogInfoPromptComponent,
} from './components/drimpac/dialog/info-prompt-dialog.component';

import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
} from './pipes';
import {
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
} from './layouts';

import {
  UserProfileService,
} from './services/user-profile.service';

import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';
import { MATERIAL_LIGHT_THEME } from './styles/material/theme.material-light';
import { MATERIAL_DARK_THEME } from './styles/material/theme.material-dark';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbAlertModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbCheckboxModule,
  NbSelectModule,
  NbIconModule,
  NbCardModule,
  NbDialogModule,
  NbEvaIconsModule,
  NbRadioModule,
  NbInputModule,
];
const COMPONENTS = [
  NgxAuthBlockComponent,
  NgxLoginComponent,
  NgxAuthComponent,
  NgxRegisterComponent,
  NgxSendResetRequestComponent,
  NgxResetPasswordComponent,
  NgxRequestPasswordComponent,
  NgxCreateAccountComponent,
  NgxLogoutComponent,
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  TinyMCEComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  DialogInfoPromptComponent,
  DialogSubmitPromptComponent,
  LineChartComponent,
];
const ENTRY_COMPONENTS = [
  DialogInfoPromptComponent,
  DialogSubmitPromptComponent,
  LineChartComponent,
];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

const GENERAL_MODULES = [
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  Ng2SmartTableModule,
  NgxEchartsModule,
  MatSlideToggleModule,
  SuiModule,
];

const SERVICES = [
  UserProfileService,
];

@NgModule({
  imports: [CommonModule, ...NB_MODULES, GENERAL_MODULES],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
  entryComponents: [...ENTRY_COMPONENTS],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'defalutv2',
          },
          [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME,MATERIAL_LIGHT_THEME, MATERIAL_DARK_THEME ],
        ).providers,
        SERVICES,
      ],
    };
  }
}
