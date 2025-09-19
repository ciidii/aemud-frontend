import {ErrorHandler, Injectable} from '@angular/core';
import * as Sentry from "@sentry/angular";

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor() {
  }

  handleError(error: unknown): void {
    // @ts-ignore
    Sentry.captureException(error.originalException | error)
  }
}
