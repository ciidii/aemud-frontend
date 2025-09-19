import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../features/auth/services/auth.service';
import {Role} from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as Role[];
  console.log(requiredRoles);
  if (authService.hasRole(requiredRoles)) {
    return true;
  }

  router.navigate(['/auth/unauthorized']);
  return false;
};
