import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ShellComponent} from "./components/shell/shell.component";

const routes: Routes = [
  {
    path: "", component: ShellComponent, children: [
      {
        path: "add-contribution",
        loadComponent: () => import("./components/add-contribution/add-contribution.component").then(bs => bs.AddContributionComponent),
        title: "AEMUD -Cotisation"
      },{
        path: '',
        redirectTo: "add-contribution",
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
