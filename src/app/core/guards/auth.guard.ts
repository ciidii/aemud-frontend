import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {SessionService} from "../services/session.service";
import {map, take} from "rxjs";


export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  return sessionService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => isLoggedIn ? true : router.createUrlTree(["/login"])),
  )

};
