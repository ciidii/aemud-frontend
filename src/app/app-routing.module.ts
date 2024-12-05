import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./shared/components/login/login.component";

const routes: Routes = [

  {
    path: "shared", loadChildren: () => import("./shared/shared.module").then(m => m.SharedModule)
  },
  {
    path: "members", loadChildren: () => import("./member/member.module").then(m => m.MemberModule)
  }
  ,
  {
    path: "configurations",
    loadChildren: () => import("./configuration/configuration.module").then(m => m.ConfigurationModule)
  },
  {
    path: "**", component: LoginComponent, data: {title: "AEMUD - Connexion"}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
