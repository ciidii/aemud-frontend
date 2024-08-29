import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MemberComponent} from "./components/member/member.component";
import {WelcomePageComponent} from "../shared/welcome-page/welcome-page.component";

const routes: Routes = [
  {path:"",component:WelcomePageComponent,children:[
      {path:"list-members",component:MemberComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoute {
}
