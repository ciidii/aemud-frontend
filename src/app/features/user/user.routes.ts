import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

export const USER_ROUTES: Routes = [
  { path: '', component: UserListComponent, title: 'User List' },
  { path: 'add', component: UserAddComponent, title: 'Add User' },
  { path: 'edit/:id', component: UserEditComponent, title: 'Edit User' },
  { path: 'details/:id', component: UserDetailsComponent, title: 'User Details' },
];