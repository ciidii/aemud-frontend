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
import {MemberComponent} from './member/components/member/member.component';
import {BootstrapStepperFormComponent} from './member/components/bootstrap-stepper-form/bootstrap-stepper-form.component';
import {ModalComponent} from './shared/components/modal/modal.component';
import {HttpClientModule} from "@angular/common/http";
import {EditMemberComponent} from './member/components/edit-member/edit-member.component';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import * as Sentry from '@sentry/angular';
import {Router} from "@angular/router";
import {GlobalErrorHandlerService} from "./shared/services/global-error-handler.service";
import {MemberModule} from "./member/member.module";
import { MainFormStep2Component } from './member/components/main-form-step-2/main-form-step-2.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomePageComponent,
    HomeComponent,
    HeaderComponent,
    MemberComponent,
    BootstrapStepperFormComponent,
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
    MemberModule

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
      provide:Title
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
