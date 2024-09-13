import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedRoutingModule} from "./shared-routing.module";
import { AsideBareComponent } from './components/aside-bare/aside-bare.component';



@NgModule({
  declarations: [
    AsideBareComponent
  ],
  imports: [
    CommonModule
  ],
    exports: [
        SharedRoutingModule,
        AsideBareComponent
    ]
})
export class SharedModule { }
