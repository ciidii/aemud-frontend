import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/member-home/member-home.component').then(
        (m) => m.MemberHomeComponent,
      ),
    children: [
      {
        path: 'list-contribution',
        loadComponent: () =>
          import('./components/dashbord/dashbord.component').then(
            (m) => m.DashbordComponent
          ),
      },
      {
        path: 'register-form',
        loadComponent: () =>
          import('./components/member-add/bootstrap-stepper-form.component').then(
            (m) => m.BootstrapStepperFormComponent
          ),
        title: 'AEMUD - Inscription',
      },
      {
        path: 'list-members',
        loadComponent: () =>
          import('./components/member-list/list-member.component').then(
            (m) => m.ListMemberComponent
          ),
        title: 'AEMUD - Liste des membres',
      },
      {
        path: 'member-details/:member-id',
        loadComponent: () =>
          import('./components/member-details/member-details.component').then(
            (m) => m.MemberDetailsComponent
          ),
      },
      {
        path: 'member-registration',
        loadComponent: () =>
          import('./components/member-registration/registration.component').then(
            (m) => m.RegistrationComponent
          ),
      },
      {
        path: '',
        redirectTo: 'list-members',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '/shared/l/404',
        pathMatch: 'full',
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberRoutingModule {
}
