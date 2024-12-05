import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {WelcomePageComponent} from "../shared/components/welcome-page/welcome-page.component";
import {ConfigRouterComponent} from "./components/config-router/config-router.component";
import {BourseAdminComponent} from "./components/bourse-admin/bourse-admin.component";
import {CommisssionAdminComponent} from "./components/commisssion-admin/commisssion-admin.component";
import {ClubsAdminComponent} from "./components/clubs-admin/clubs-admin.component";

const routes: Routes = [
  {
    path: "config", component: WelcomePageComponent, children: [
      {
        path: "", component: ConfigRouterComponent, children: [
          {path: "home", component: BourseAdminComponent, data: {title: "Bourse - administration"}},
          {
            path: "commission-admin",
            component: CommisssionAdminComponent,
            data: {title: "Commissions - administration"}
          },
          {path: "club-admin", component: ClubsAdminComponent, data: {title: "Clubs - administration"}},
        ],
        data: {title: "Paramétrage de l'application"}
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
