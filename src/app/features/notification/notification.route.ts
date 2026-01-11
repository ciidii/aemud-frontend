import {Routes} from "@angular/router";
import {SmsTemplatesPageComponent} from "./pages/sms-templates/sms-templates.page";
import {NotificationDashboardComponent} from "./pages/notification-dashboard/notification-dashboard.component";
import {CampaignsListComponent} from "./pages/campaigns-list/campaigns-list.component";
import {AudiencesComponent} from "./pages/audiences/audiences.component";

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: NotificationDashboardComponent,
    title: 'Dashboard Notifications'
  },
  {
    path: 'campaigns',
    component: CampaignsListComponent,
    title: 'Campagnes de Communication'
  },
  {
    path: 'templates',
    component: SmsTemplatesPageComponent,
    title: 'Modèles de Communication'
  },
  {
    path: 'audiences',
    component: AudiencesComponent,
    title: 'Audiences de Communication'
  },
  {
    path: '',
    redirectTo: 'campaigns',
    pathMatch: 'full'
  }
];
