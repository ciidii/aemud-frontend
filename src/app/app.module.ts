import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from './shared/components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WelcomePageComponent} from './shared/components/welcome-page/welcome-page.component';
import {HomeComponent} from './shared/components/home/home.component';
import {HeaderComponent} from './core/header/header.component';
import {MemberComponent} from './member/components/member/member.component';
import {AddMemberComponent} from './member/components/add-member/add-member.component';
import {ModalComponent} from './shared/components/modal/modal.component';
import {HttpClientModule} from "@angular/common/http";
import {EditMemberComponent} from './member/components/edit-member/edit-member.component';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import * as Sentry from '@sentry/angular';
import {Router} from "@angular/router";
import {GlobalErrorHandlerService} from "./shared/services/global-error-handler.service";

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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
