import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {LayoutComponent} from "./components/layout/layout.component";
import {MultiSelectDropdownComponent} from "./components/multi-select-dropdown/multi-select-dropdown.component";

const routes: Routes = [
  {
    path: "", component: LayoutComponent,

    children: [
      {
        path: "login", component: LoginComponent,
        title: "AEMUD - Connexion"
      },
      {path: "shell", component: HomeComponent, title: "AEMUD - Acceuil"},
      {path: "multi-select", component: MultiSelectDropdownComponent, title: "AEMUD - Acceuil"},
    ],
    title: "AEMUD - Connexion"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class SharedRoutingModule {

}
