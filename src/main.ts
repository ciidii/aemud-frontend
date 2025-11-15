import * as Sentry from "@sentry/angular";
import {environment} from "./environments/environment.development";
import {AppComponent} from './app/app.component';
import {provideAnimations} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {bootstrapApplication, BrowserModule, Title} from '@angular/platform-browser';
import {provideRouter, Router} from '@angular/router';
import {APP_INITIALIZER, ErrorHandler, importProvidersFrom, LOCALE_ID} from '@angular/core';
import {registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {routes} from "./app/app-routing";
import {authInterceptor} from "./app/core/interceptors/auth.interceptor";

registerLocaleData(localeFr);
Sentry.init({
  dsn: environment.features[0].sentryDsn,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", "http://localhost:4300"],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0,
});

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, NgbModule, ReactiveFormsModule, ToastrModule.forRoot()),
    {
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
    },
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideAnimations(),
    {provide: LOCALE_ID, useValue: 'fr'}
  ]
})
  .catch(err => console.error(err));
