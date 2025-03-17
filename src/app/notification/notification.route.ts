import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {NotificationShellComponent} from "./components/shell/notification-shell.component";

const routes: Routes = [
  {
    path: "", component: NotificationShellComponent, children: [
      {
        path: "sms",
        loadComponent: () => import("./components/sms/sms.component").then(bs => bs.SmsComponent),
        title: "AEMUD -SMS"
      },
      {
        path: '',
        redirectTo: "sms",
        pathMatch: "full"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoute {
}
