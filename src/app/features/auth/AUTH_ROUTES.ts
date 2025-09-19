import {Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {PasswordForgottenComponent} from "./components/password-forgotten/password-forgotten.component";
import {
  FirstConnectionPasswordComponent
} from "./components/first-connection-password/first-connection-password.component";
import {SignupComponent} from "./components/signup/signup.component";
import {ChangePasswordComponent} from "./components/change-password/change-password.component";
import {UnauthorizedComponent} from "./pages/unauthorized/unauthorized.component";

export const APP_ROUTES: Routes = [
  {path: 'login', component: LoginComponent, title: ' Authentication'},
  {path: 'signup', component: SignupComponent, title: 'Inscription'},
  {path: 'password-forgotten', component: PasswordForgottenComponent, title: 'Mot de passe oublier'},
  {path: 'first-connection-password', component: FirstConnectionPasswordComponent, title: 'Premier mot de passe'},
  {path: 'change-password', component: ChangePasswordComponent, title: 'Changer le mot de passe'},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    title: 'Accès non autorisé',
  }
]
