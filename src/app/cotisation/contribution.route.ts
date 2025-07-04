import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ShellComponent} from "./components/shell/shell.component";

const routes: Routes = [
  {
    path: "", component: ShellComponent, children: [
      {
        path: "add-contribution",
        loadComponent: () => import("./components/contribution-home/contribution-home.component").then(bs => bs.ContributionHomeComponent),
        title: "AEMUD -Cotisation"
      },{
        path: '**',
        redirectTo: "/shared/404",
        pathMatch:"full"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributionRoute {
}
