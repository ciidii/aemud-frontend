import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MemberComponent} from "./components/member/member.component";
import {WelcomePageComponent} from "../shared/components/welcome-page/welcome-page.component";
import {MemberHomeComponent} from "./components/member-home/member-home.component";
import {AddMemberComponent} from "./components/add-member/add-member.component";

const routes: Routes = [
  {
    path: "member", component: WelcomePageComponent, children: [
      {
        path: "", component: MemberHomeComponent, children: [
          {path: "register-form", component: AddMemberComponent},
          {path: "list-members", component: MemberComponent},

        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoute {
}
