import { Routes } from '@angular/router';
import { AuthGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: 'shared',
    loadChildren: () => import('./shared/shared.routes').then(m => m.SHARED_ROUTES),
    canActivate: [AuthGuard],
    title: 'Accueil',
  },
  {
    path: 'members',
    loadChildren: () => import('./features/member/member.routes').then(m => m.MEMBER_ROUTES),
    canActivate: [AuthGuard],
    title: 'Membres',
  },
  {
    path: 'engagements',
    loadChildren: () => import('./features/configuration/config.routes').then(m => m.ENGAGEMENT_ROUTES),
    canActivate: [AuthGuard],
    title: 'engagements',
  },
  {
    path: 'contributions',
    loadChildren: () => import('./features/contribution/contribution.route').then(m => m.CONTRIBUTION_ROUTES),
    canActivate: [AuthGuard],
    title: 'Contributions'
  },
  {
    path: 'notifications',
    loadChildren: () => import('./features/notification/notification.route').then(m => m.NOTIFICATIONS_ROUTES),
    canActivate: [AuthGuard],
    title: 'Notifications',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/AUTH_ROUTES').then(m => m.APP_ROUTES),
    title: 'Authentication',
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'shared/l/404',
  },
];
