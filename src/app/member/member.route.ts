import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {WelcomePageComponent} from "../shared/components/welcome-page/welcome-page.component";
import {MemberHomeComponent} from "./components/member-home/member-home.component";

const routes: Routes = [
  {
    path: "member", component: WelcomePageComponent, children: [
      {
        path: "", component: MemberHomeComponent, children: [
          {
            path: "register-form",
            loadComponent: () => import("./components/bootstrap-stepper-form/bootstrap-stepper-form.component").then(bs => bs.BootstrapStepperFormComponent),
            title: "AEMUD -Inscription"
          },
          {
            path: "list-members",
            loadComponent: () => import("./components/list-member/list-member.component").then(lm => lm.ListMemberComponent),
            title: "AEMUD Listes membrers "
          },
          {
            path: "member-details/:member-id",
            loadComponent: () => import("./components/member-details/member-details.component").then(md => md.MemberDetailsComponent),
          },
          {
            path: "modal-test",
            loadComponent: () => import("./components/filter-popup/filter-popup.component").then(md => md.FilterPopupComponent),
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
