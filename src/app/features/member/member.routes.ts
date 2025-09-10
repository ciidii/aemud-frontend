import {Routes} from '@angular/router';
import {MemberListComponent} from "./components/member-list/member-list.component";
import {MemberDashboardComponent} from "./components/member-dashboard/member-dashboard.component";
import {MemberAddComponent} from "./components/member-add/member-add.component";

export const  MEMBER_ROUTES: Routes = [
  {path: 'list-members', component: MemberListComponent, title: ' Liste des membres'},
  {path: 'register-form', component: MemberAddComponent, title: ' Ajouter un membre'},
  {path: 'list-contribution', component: MemberDashboardComponent, title: 'Dashboard des membres'},
  {
    path: 'details/:id',
    loadComponent: () => import('./pages/member-detail/member-detail.component').then(m => m.MemberDetailComponent),
    title: 'Détails du membre'
  },
];
