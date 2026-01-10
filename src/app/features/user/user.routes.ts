import {Routes} from '@angular/router';
import {UserListComponent} from './pages/user-list/user-list.component';
import {UserAddComponent} from './pages/user-add/user-add.component';
import {UserDetailsComponent} from './pages/user-details/user-details.component';

export const USER_ROUTES: Routes = [
  {path: '', component: UserListComponent, title: 'User List'},
  {path: 'add', component: UserAddComponent, title: 'ajouter une utilisateurs'},
  {path: 'add/:id', component: UserAddComponent, title: 'ajouter une utilisateurs'},
  {path: 'details/:id', component: UserDetailsComponent, title: 'User Details'},
];
