import { Component } from '@angular/core';
import { NbSidebarService, NbMenuItem } from '@nebular/theme';
import { NbIconLibraries } from '@nebular/theme';
import { MENU_ITEMS } from './pages-menu';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  menu: NbMenuItem[];
  role: string;
  constructor(private iconLibraries: NbIconLibraries,
    private sidebarService: NbSidebarService,
    private authService: NbAuthService) {
    this.iconLibraries.registerSvgPack('open-adr', {
          'ven': '<img src="assets/images/icon_vens.png" style="width: 2.5em; margin-left: -1.1rem">',
          'vtn': '<img src="assets/images/icon_vtn.png" style="width: 2.5em; margin-left: -1.1rem">',
          // ...
    });

    this.menu = MENU_ITEMS;
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.role = token['payload']['role'];
          this.menu = this.menu.map(val => {
            if (val['title'] === 'User Administration' || val['title'] === 'System Parameters') {
              val['hidden'] = this.role !== 'admin';
            }
            return val;
          });
        }
      });
  }


  onPageClicked() {
    this.sidebarService.collapse('settings-sidebar');
  }
}
