import {inject} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from "../../features/auth/services/auth.service";
import {NotificationService} from "../services/notification.service";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  // The browser now automatically sends the HttpOnly cookie,
  // so we no longer need to add the Authorization header manually.
  // The original request is passed through unmodified.

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If the cookie is expired or invalid, the API will return a 401 Unauthorized status.
      if (error.status === 401) {
        notificationService.showWarning("Votre session a expiré, veuillez vous reconnecter !");
        authService.logout().subscribe(); // Call logout and subscribe to trigger the request
      }
      return throwError(() => error);
    })
  );
};
