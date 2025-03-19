import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'shared',
    loadChildren: () => import('./shared/shared-routing.module').then(m => m.SharedRoutingModule),
    title: 'Accueil',
  },
  {
    path: 'members',
    loadChildren: () => import('./member/member.route').then(m => m.MemberRoutingModule),
    title: 'Membres',
  },
  {
    path: 'configurations',
    loadChildren: () => import('./configuration/config.routes').then(m => m.ConfigRoutes),
    title: 'Configurations',
  },
  {
    path: 'contributions',
    loadChildren: () => import('./cotisation/contribution.route').then(m => m.ContributionRoute),
    title: 'Contributions'
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notification/notification.route').then(m => m.NotificationRoute),
    title: 'Notifications',
  },
  {
    path: '',
    redirectTo: 'shared/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'shared/l/404',
  },
];
