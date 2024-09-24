import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {WelcomePageComponent} from "./components/welcome-page/welcome-page.component";

const routes: Routes = [
  {
    path: "", component: WelcomePageComponent, children: [
      {path: "login", component: LoginComponent,data:{title:"AEMUD - Connexion"}},
      {path: "home", component: HomeComponent,data:{title:"AEMUD - Acceuil"}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule {

}
