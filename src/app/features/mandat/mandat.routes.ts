import {Routes} from '@angular/router';

export const MANDAT_ROUTES: Routes = [
  {
    path: 'mandat-add',
    loadComponent: () => import('./pages/mandat-add/mandat-add.component').then(m => m.MandatAddComponent),
    title: 'Ajouter mandat'
  },
];
