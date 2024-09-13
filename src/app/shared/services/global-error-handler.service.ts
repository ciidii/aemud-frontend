import {ErrorHandler, Injectable} from '@angular/core';
import * as Sentry from "@sentry/angular";

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor() {
  }

  handleError(error: any): void {
    Sentry.captureException(error.originalException | error)
  }
}
