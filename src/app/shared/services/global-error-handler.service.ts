import {ErrorHandler, Injectable} from '@angular/core';
import * as Sentry from "@sentry/angular";

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor() {
  }

  handleError(error: unknown): void {
    Sentry.captureException(error.originalException | error)
  }
}
