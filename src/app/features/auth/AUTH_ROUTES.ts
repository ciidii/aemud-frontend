import {Routes} from "@angular/router";
import {LoginComponent} from "./pages/login/login.component";
import {PasswordForgottenComponent} from "./pages/password-forgotten/password-forgotten.component";
import {
  FirstConnectionPasswordComponent
} from "./pages/first-connection-password/first-connection-password.component";
import {SignupComponent} from "./pages/signup/signup.component";
import {ChangePasswordComponent} from "./pages/change-password/change-password.component";
import {UnauthorizedComponent} from "./pages/unauthorized/unauthorized.component";
import {AuthLayoutComponent} from "./layout/auth-layout/auth-layout.component";

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {path: 'login', component: LoginComponent, title: 'Authentication'},
      {path: 'signup', component: SignupComponent, title: 'Inscription'},
      {path: 'password-forgotten', component: PasswordForgottenComponent, title: 'Mot de passe oublier'},
      {path: 'first-connection-password', component: FirstConnectionPasswordComponent, title: 'Premier mot de passe'},
      {path: 'change-password', component: ChangePasswordComponent, title: 'Changer le mot de passe'},
      {path: 'unauthorized', component: UnauthorizedComponent, title: 'Accès non autorisé'},
      {path: '', redirectTo: 'login', pathMatch: 'full'},
    ]
  }
]
