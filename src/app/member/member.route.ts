import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MemberComponent} from "./components/member/member.component";
import {WelcomePageComponent} from "../shared/components/welcome-page/welcome-page.component";
import {MemberHomeComponent} from "./components/member-home/member-home.component";
import {BootstrapStepperFormComponent} from "./components/bootstrap-stepper-form/bootstrap-stepper-form.component";

const routes: Routes = [
  {
    path: "member", component: WelcomePageComponent, children: [
      {
        path: "", component: MemberHomeComponent, children: [
          {path: "register-form", component: BootstrapStepperFormComponent, data: {title: "Membre - Formulaire"}},
          {path: "list-members", component: MemberComponent, data: {title: "Membre - Liste Membre"}},
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
