import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LayoutComponent} from "../shared/components/layout/layout.component";
import {ShellComponent} from "./components/shell/shell.component";
import {BourseAdminPageComponent} from "./components/bourse-admin-page/bourse-admin-page.component";
import {CommisssionAdminComponent} from "./components/commission-admin-page/commisssion-admin.component";
import {ClubsAdminPageComponent} from "./components/clubs-admin-page/clubs-admin-page.component";
import {SessionComponent} from "./components/session-admin-page/session.component";

const routes: Routes = [
  {
    path: "config", component: LayoutComponent, children: [
      {
        path: "", component: ShellComponent, children: [
          {path: "shell", component: BourseAdminPageComponent, title: "Bourse - administration"},
          {
            path: "commission-admin",
            component: CommisssionAdminComponent,
            title: "Commissions - administration"
          },
          {path: "club-admin", component: ClubsAdminPageComponent, title: "ClubModel - administration"},
          {path: "session-admin-page-admin", component: SessionComponent, title: "Sessions -  Administration"}
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
export class ConfigRoutes {
}
