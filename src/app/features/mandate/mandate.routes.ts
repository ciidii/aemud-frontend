import {Routes} from '@angular/router';
import {PeriodeMandatListComponent} from './pages/mandat-list/periode-mandat-list.component';
import {PeriodeMandatAddEditComponent} from './pages/mandat-add-edit/periode-mandat-add-edit.component';
import {PeriodeMandatDetailComponent} from './pages/mandat-detail/periode-mandat-detail.component';
import {PhaseEditComponent} from './pages/phase-edit/phase-edit.component';

export const MANDATE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: PeriodeMandatListComponent,
    title: 'Gouvernance & Mandats'
  },
  {
    path: 'add',
    component: PeriodeMandatAddEditComponent,
    title: 'Nouveau Mandat'
  },
  {
    path: 'edit/:id',
    component: PeriodeMandatAddEditComponent,
    title: 'Modifier le Mandat'
  },
  {
    path: 'phases/edit/:id',
    component: PhaseEditComponent,
    title: 'Modifier une Phase'
  },
  {
    path: ':id',
    component: PeriodeMandatDetailComponent,
    title: 'Détails du Mandat'
  }
];

// Alias for backwards compatibility
export {MANDATE_ROUTES as PERIODE_MANDAT_ROUTES};
