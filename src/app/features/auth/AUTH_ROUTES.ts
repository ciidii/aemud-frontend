import {Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {PasswordForgottenComponent} from "./components/password-forgotten/password-forgotten.component";
import {CodeValidationComponent} from "./components/code-validation/code-validation.component";
import {NewPasswordComponent} from "./components/new-password/new-password.component";

export const APP_ROUTES: Routes = [
  {path: 'login', component: LoginComponent, title: ' Authentication'},
  {path: 'password-forgotten', component:PasswordForgottenComponent, title: 'Mot de passe oublier'},
  {path: 'code-validation', component: CodeValidationComponent, title: 'Valider le code'},
  {path: 'new-password', component: NewPasswordComponent, title: 'Nouveau mot de passe'},
]
