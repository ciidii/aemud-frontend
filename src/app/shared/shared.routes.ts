import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { NotFoundComponent } from "./pages/not-found/not-found.component";

export const SHARED_ROUTES: Routes = [
  {
    path: 'l',
    component: LayoutComponent,
    children: [
      {
        path: 'home-layout',
        component: LayoutComponent,
        title: "Page d'accueil",
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
