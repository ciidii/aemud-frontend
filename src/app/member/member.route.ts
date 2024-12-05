import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ListMemberComponent} from "./components/list-member/list-member.component";
import {WelcomePageComponent} from "../shared/components/welcome-page/welcome-page.component";
import {MemberHomeComponent} from "./components/member-home/member-home.component";
import {BootstrapStepperFormComponent} from "./components/bootstrap-stepper-form/bootstrap-stepper-form.component";
import {MemberDetailsComponent} from "./components/member-details/member-details.component";

const routes: Routes = [
  {
    path: "member", component: WelcomePageComponent, children: [
      {
        path: "", component: MemberHomeComponent, children: [
          {
            path: "register-form",
            loadComponent: () => import("./components/bootstrap-stepper-form/bootstrap-stepper-form.component").then(bs => bs.BootstrapStepperFormComponent),
            data: {title: "Membre - Formulaire"}
          },
          {
            path: "list-members",
            loadComponent: () => import("./components/list-member/list-member.component").then(lm => lm.ListMemberComponent),
            data: {title: "Membre - Liste Membre"}
          },
          {
            path: "member-details/:member-id",
            loadComponent: () => import("./components/member-details/member-details.component").then(md => md.MemberDetailsComponent),
            data: {title: "Member Details"}
          },
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
