import {Routes} from "@angular/router";
import {SmsInstantPageComponent} from "./pages/sms-instant/sms-instant.page";

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: 'sms',
    component: SmsInstantPageComponent,
    title: 'SMS'
  }
];
