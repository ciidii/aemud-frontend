import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfigRouterComponent} from './components/config-router/config-router.component';
import {RouterOutlet} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {ConfigRoute} from "./config.route";
import {BourseAdminComponent} from './components/bourse-admin/bourse-admin.component';
import { CommisssionAdminComponent } from './components/commisssion-admin/commisssion-admin.component';
import { ClubsAdminComponent } from './components/clubs-admin/clubs-admin.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ConfigRouterComponent,
    BourseAdminComponent,
    CommisssionAdminComponent,
    ClubsAdminComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    ConfigRoute
  ]
})
export class ConfigurationModule {
}
