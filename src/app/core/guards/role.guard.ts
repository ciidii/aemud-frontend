import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthHttpService} from '../../features/auth/services/auth-http.service';
import {Role} from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthHttpService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as Role[];
  console.log(requiredRoles);
  if (authService.hasRole(requiredRoles)) {
    return true;
  }

  router.navigate(['/auth/unauthorized']);
  return false;
};
