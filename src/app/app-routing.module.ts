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
    path: "**", component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
