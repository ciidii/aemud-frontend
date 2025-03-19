import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {LayoutComponent} from './components/layout/layout.component';
import {HomeComponent} from './components/home/home.component';
import {NotFoundComponent} from "./pages/not-found/not-found.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'AEMUD - Connexion',
  },
  {
    path: 'l',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        title: 'Page d\'accueil',
      },
      {
        path: '404',
        component: NotFoundComponent,
        title: 'Page non trouvée',
      }
    ],
  },
  {
    path: '',
    redirectTo: 'l/404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {
}
