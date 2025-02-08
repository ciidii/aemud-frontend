import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {WelcomePageComponent} from "../shared/components/welcome-page/welcome-page.component";
import {MemberHomeComponent} from "../member/components/member-home/member-home.component";
import {HomeComponent} from "./components/home/home.component";

const routes: Routes = [
  {
    path: "", component: HomeComponent, children: [
      {
        path: "contribute",
        loadComponent: () => import("./components/contribute/contribute.component").then(bs => bs.ContributeComponent),
        title: "AEMUD -Cotisation"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotisationModule {
}
