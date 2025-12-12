import {Routes} from "@angular/router";
import {SmsInstantPageComponent} from "./pages/sms-instant/sms-instant.page";
import {SmsTemplatesPageComponent} from "./pages/sms-templates/sms-templates.page";

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: 'sms',
    component: SmsInstantPageComponent,
    title: 'SMS'
  },
  {
    path: 'templates',
    component: SmsTemplatesPageComponent,
    title: 'Modèles SMS'
  }
];
