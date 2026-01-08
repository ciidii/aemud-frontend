import {Routes} from '@angular/router';
import {PhaseEditComponent} from "./pages/phase-edit/phase-edit.component";

export const PHASE_ROUTES: Routes = [
  {
    path: 'edit/:id',
    component: PhaseEditComponent,
    title: 'Modifier une Phase'
  }
];
