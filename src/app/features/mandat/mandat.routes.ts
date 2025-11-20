import {Routes} from '@angular/router';
import { MandatListComponent } from './pages/mandat-list/mandat-list.component';
import { MandatAddEditComponent } from './pages/mandat-add-edit/mandat-add-edit.component';
import { MandatDetailComponent } from './pages/mandat-detail/mandat-detail.component';

export const MANDAT_ROUTES: Routes = [
  {
    path: 'list',
    component: MandatListComponent,
    title: 'Liste des mandats'
  },
  {
    path: 'add',
    component: MandatAddEditComponent,
    title: 'Ajouter un mandat'
  },
  {
    path: 'edit/:id',
    component: MandatAddEditComponent,
    title: 'Modifier un mandat'
  },
  {
    path: ':id',
    component: MandatDetailComponent,
    title: 'Détail du Mandat'
  },
];
