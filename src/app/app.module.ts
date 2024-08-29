import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './shared/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { WelcomePageComponent } from './shared/welcome-page/welcome-page.component';
import { HomeComponent } from './shared/home/home.component';
import { HeaderComponent } from './core/header/header.component';
import { MemberComponent } from './member/components/member/member.component';
import { AddMemberComponent } from './member/components/add-member/add-member.component';
import { ModalComponent } from './shared/modal/modal.component';
import {HttpClientModule} from "@angular/common/http";
import { EditMemberComponent } from './member/components/edit-member/edit-member.component';
import { AppErrorsComponent } from './core/app-errors/app-errors.component';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomePageComponent,
    HomeComponent,
    HeaderComponent,
    MemberComponent,
    AddMemberComponent,
    ModalComponent,
    EditMemberComponent,
    AppErrorsComponent,

  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule

    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
