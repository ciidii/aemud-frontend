import {Routes} from "@angular/router";

export const CONTRIBUTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/finance-dashboard/finance-dashboard.component').then(m => m.FinanceDashboardComponent),
    title: 'Trésorerie & Cotisations'
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/finance-desk/finance-desk.component').then(m => m.FinanceDeskComponent),
    title: 'Guichet d\'Encaissement'
  },
  {
    path: 'donations',
    loadComponent: () => import('./pages/donations-list/donations-list.component').then(m => m.DonationsListComponent),
    title: 'Mécénat & Dons Alumni'
  }
];
