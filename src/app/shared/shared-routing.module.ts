import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {WelcomePageComponent} from "./welcome-page/welcome-page.component";

const routes: Routes = [
  {
    path: "", component: WelcomePageComponent, children: [
      {path: "login", component: LoginComponent},
      {path: "home", component: HomeComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule {

}
