import {Routes} from '@angular/router';
import {authGuard} from "./core/guards/auth.guard";
import {LayoutComponent} from "./shared/components/layout/layout.component";
import {Role} from "./core/models/user.model";
import {roleGuard} from "./core/guards/role.guard";


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: 'shared',
        loadChildren: () => import('./shared/shared.routes').then(m => m.SHARED_ROUTES),
        canActivate: [authGuard],
        title: 'Accueil',
        data: {roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER]}
      },
      {
        path: 'members',
        loadChildren: () => import('./features/member/member.routes').then(m => m.MEMBER_ROUTES),
        title: 'Membres',
        canActivate: [authGuard],
        data: {roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER]}
      },
      {
        path: 'configurations',
        loadChildren: () => import('./features/configuration/config.routes').then(m => m.CONFIG_ROUTES),
        canActivate: [authGuard],
        title: 'engagements',
        data: {roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER]}
      },
      {
        path: 'contributions',
        loadChildren: () => import('./features/contribution/contribution.route').then(m => m.CONTRIBUTION_ROUTES),
        canActivate: [authGuard],
        title: 'Contributions',
        data: {roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER]}
      },
      {
        path: 'notifications',
        loadChildren: () => import('./features/notification/notification.route').then(m => m.NOTIFICATIONS_ROUTES),
        canActivate: [authGuard],
        title: 'Notifications',
        data: {roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER]}
      },
      {
        path: 'users',
        loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES),
        canActivate: [authGuard, roleGuard],
        title: 'Users',
        data: {roles: [Role.SUPER_ADMIN, Role.ADMIN]}
      },
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/AUTH_ROUTES').then(m => m.APP_ROUTES),
    title: 'Authentication',
  }
  ,
  {
    path: '**',
    redirectTo: 'auth/login',
  }
];
