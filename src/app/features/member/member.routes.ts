import {Routes} from '@angular/router';
import {MemberListComponent} from "./components/member-list/member-list.component";
import {MemberAddFormComponent} from "./components/member-add-form/member-add-form.component";
import {MemberDashboardComponent} from "./components/member-dashboard/member-dashboard.component";

export const  MEMBER_ROUTES: Routes = [
  {path: 'list-members', component: MemberListComponent, title: ' Liste des membres'},
  {path: 'register-form', component: MemberAddFormComponent, title: ' Ajouter un membre'},
  {path: 'list-contribution', component: MemberDashboardComponent, title: 'Dashboard des membres'},
];
