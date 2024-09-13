import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MemberRoute} from "./member.route";
import { MemberHomeComponent } from './components/member-home/member-home.component';
import {SharedModule} from "../shared/shared.module";



@NgModule({
  declarations: [
    MemberHomeComponent
  ],
    imports: [
        CommonModule,
        SharedModule
    ],
  exports: [MemberRoute]
})
export class MemberModule { }
