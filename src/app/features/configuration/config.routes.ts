import {Routes} from "@angular/router";
import {BourseAdminComponent} from "./components/bourse-admin/bourse-admin.component";
import {CommissionAdminComponent} from "./components/commission-admin/commission-admin.component";
import {ClubAdminComponent} from "./components/club-admin/club-admin.component";
import {SessionAdminComponent} from "./components/session-admin/session-admin.component";
import {EventAdminComponent} from "./components/event-admin/event-admin.component";

export const CONFIG_ROUTES : Routes = [
  {path: 'bourse-admin', component: BourseAdminComponent, title: 'Gestion des bourses'},
  {path: 'commission-admin', component: CommissionAdminComponent, title: 'Gestion des commissions'},
  {path: 'club-admin', component: ClubAdminComponent, title: 'Gestion des clubs'},
  {path: 'session-admin', component: SessionAdminComponent, title: 'Gestion des sessions'},
  {path: 'event-admin', component: EventAdminComponent, title: 'Gestion des évènements'},
];
