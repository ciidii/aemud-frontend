import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MemberRoute} from "./member.route";
import {MemberHomeComponent} from './components/member-home/member-home.component';
import {SharedModule} from "../shared/shared.module";
import {MembershipInfoComponent} from './components/membership-info/membership-info.component';
import {AcademicInfoComponent} from './components/academic-info/academic-info.component';
import {AddressInfoComponent} from './components/address-info/address-info.component';
import {ContactInfoComponent} from './components/contact-info/contact-info.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MainFormStep1Component} from './components/main-form-step-1/main-form-step-1.component';
import {PersonalInfoComponent} from './components/personal-info/personal-info.component';
import {MemberDetailsComponent} from './components/member-details/member-details.component';


@NgModule({
  declarations: [
    MemberHomeComponent,
    MembershipInfoComponent,
    AcademicInfoComponent,
    AddressInfoComponent,
    ContactInfoComponent,
    MainFormStep1Component,
    PersonalInfoComponent,
    MemberDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
      MemberRoute
    , MembershipInfoComponent
    , AcademicInfoComponent
    , AddressInfoComponent
    , ContactInfoComponent
    , MainFormStep1Component]
})
export class MemberModule {
}
