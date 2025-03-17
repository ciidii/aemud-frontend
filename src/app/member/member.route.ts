import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LayoutComponent} from "../shared/components/layout/layout.component";
import {MemberHomeComponent} from "./components/member-home/member-home.component";

const routes: Routes = [
  {
    path: "member", component: LayoutComponent, children: [
      {
        path: "", component: MemberHomeComponent, children: [
          {
            path: "list-contribution",
            loadComponent: () => import("./components/dashbord/dashbord.component").then(md => md.DashbordComponent),
          },
          {
            path: "register-form",
            loadComponent: () => import("./components/form-bootstrap-stepper/bootstrap-stepper-form.component").then(bs => bs.BootstrapStepperFormComponent),
            title: "AEMUD -Inscription"
          },
          {
            path: "list-members",
            loadComponent: () => import("./components/member-list/list-member.component").then(lm => lm.ListMemberComponent),
            title: "AEMUD Listes membrers "
          },
          {
            path: "member-details/:member-id",
            loadComponent: () => import("./components/member-details/member-details.component").then(md => md.MemberDetailsComponent),
          },
          {
            path: "member-registration",
            loadComponent: () => import("./components/member-registration/registration.component").then(md => md.RegistrationComponent),
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
