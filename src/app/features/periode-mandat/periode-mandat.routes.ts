import {Routes} from '@angular/router';
import {PeriodeMandatListComponent} from './pages/mandat-list/periode-mandat-list.component';
import {PeriodeMandatAddEditComponent} from './pages/mandat-add-edit/periode-mandat-add-edit.component';
import {PeriodeMandatDetailComponent} from './pages/mandat-detail/periode-mandat-detail.component';

export const PERIODE_MANDAT_ROUTES: Routes = [
  {
    path: 'list',
    component: PeriodeMandatListComponent,
    title: 'Liste des Périodes de Mandat'
  },
  {
    path: 'add',
    component: PeriodeMandatAddEditComponent,
    title: 'Ajouter une Période de Mandat'
  },
  {
    path: 'edit/:id',
    component: PeriodeMandatAddEditComponent,
    title: 'Modifier une Période de Mandat'
  },
  {
    path: ':id',
    component: PeriodeMandatDetailComponent,
    title: 'Détail de la Période de Mandat'
  },
];
