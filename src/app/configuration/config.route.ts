import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {WelcomePageComponent} from "../shared/components/welcome-page/welcome-page.component";
import {ConfigRouterComponent} from "./components/config-router/config-router.component";
import {BourseAdminComponent} from "./components/bourse-admin/bourse-admin.component";
import {CommisssionAdminComponent} from "./components/commisssion-admin/commisssion-admin.component";
import {ClubsAdminComponent} from "./components/clubs-admin/clubs-admin.component";
import {SessionComponent} from "./components/session/session.component";

const routes: Routes = [
  {
    path: "config", component: WelcomePageComponent, children: [
      {
        path: "", component: ConfigRouterComponent, children: [
          {path: "home", component: BourseAdminComponent, title: "Bourse - administration"},
          {
            path: "commission-admin",
            component: CommisssionAdminComponent,
            title: "Commissions - administration"
          },
          {path: "club-admin", component: ClubsAdminComponent, title: "Clubs - administration"},
          {path:"session-admin",component:SessionComponent,title:"Sessions -  Administration"}
        ],
        title: "Paramétrage de l'application"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoute {
}
