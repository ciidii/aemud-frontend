import {inject} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from "../../features/auth/services/auth.service";
import {tap} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const toaster = inject(ToastrService);

  const authToken = localStorage.getItem('aemud_auth_token');

  // Liste des endpoints publics, version regex
  const publicEndpointsRegex: RegExp[] = [
    /\/auth\/authenticate$/,
    /\/users\/reset-password-email$/,
    /\/users\/check-valide-token$/,
    /\/users\/forgotten-password-email$/,
    /\/users\/change-password-forgotten$/
  ];

  // Vérifie si l'URL correspond exactement à l'un des endpoints publics
  const isPublic = publicEndpointsRegex.some(regex => regex.test(req.url));

  // Si l'endpoint n'est pas public et qu'on a un token, on ajoute le Bearer
  const authReq = authToken && req.url.includes('api/') && !isPublic
    ? req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    })
    : req;

  return next(authReq).pipe(
    tap(() => {
    }),
    catchError((error: HttpErrorResponse) => {
      console.log(error?.error?.error?.code);
      if (error?.error?.error?.code === "JWT_TOKEN_EXPIRED") {
        toaster.warning("Votre session a expiré, veuillez vous reconnecter !");
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
