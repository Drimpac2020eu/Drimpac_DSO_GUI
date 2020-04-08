import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Unified DR interoperability framework enabling market participation of active energy consumers</span>
    <div class="socials">
      <a href="mailto:info@drimpac-h2020.eu" target="_blank" class="ion ion-email-unread" [ngStyle]="{'font-size':'34px'}"></a>
      <a href="https://twitter.com/Drimpac_H2020" target="_blank" class="ion ion-social-twitter"></a>
      <a href="https://www.linkedin.com/company/drimpac-eu-h2020/" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
}
