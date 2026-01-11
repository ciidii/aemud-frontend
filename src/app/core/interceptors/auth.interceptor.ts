import {inject} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthHttpService} from "../../features/auth/services/auth-http.service";
import {NotificationService} from "../services/notification.service";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthHttpService);
  const notificationService = inject(NotificationService);

  // Clone the request to add the withCredentials flag.
  // This is necessary for the browser to send the HttpOnly auth cookie.
  const authReq = req.clone({
    withCredentials: true,
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If the cookie is expired or invalid, the API will return a 401 Unauthorized status.
      // If the user is locked or unauthorized, the API might return a 403 Forbidden status.
      if ((error.status === 401 || error.status === 403) && !error.url?.includes("auth/authenticate") && !error.url?.includes("auth/logout")) {
        notificationService.showWarning("Votre session a expiré ou vous n'êtes pas autorisé. Veuillez vous reconnecter !");
        authService.logout().subscribe(); // Call logout and subscribe to trigger the request
      }
      return throwError(() => error);
    })
  );
};
