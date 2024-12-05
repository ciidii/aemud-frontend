import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from './shared/components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WelcomePageComponent} from './shared/components/welcome-page/welcome-page.component';
import {HomeComponent} from './shared/components/home/home.component';
import {HeaderComponent} from './core/header/header.component';
import {ListMemberComponent} from './member/components/list-member/list-member.component';
import {
  BootstrapStepperFormComponent
} from './member/components/bootstrap-stepper-form/bootstrap-stepper-form.component';
import {ModalComponent} from './member/components/modal/modal.component';
import {HttpClientModule} from "@angular/common/http";
import {EditMemberComponent} from './member/components/edit-member/edit-member.component';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import * as Sentry from '@sentry/angular';
import {Router} from "@angular/router";
import {MemberModule} from "./member/member.module";
import {MainFormStep2Component} from './member/components/main-form-step-2/main-form-step-2.component';
import {ConfigurationModule} from "./configuration/configuration.module";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomePageComponent,
    HeaderComponent,
    ListMemberComponent,
    ModalComponent,
    EditMemberComponent,
    MainFormStep2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    MemberModule,
    ConfigurationModule,
    HomeComponent

  ],
  providers: [{
    provide: ErrorHandler,
    useValue: Sentry.createErrorHandler({
      showDialog: false,
    }),
  }, {
    provide: Sentry.TraceService,
    deps: [Router],
  },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {
      },
      deps: [Sentry.TraceService],
      multi: true,
    },
    {
      provide: Title
    }

  ],
  exports: [
    HeaderComponent,
    MainFormStep2Component
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
