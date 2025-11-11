import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth.service';
import { NAVIGATION_ROUTES } from '@shared/constants/navigation.constant';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();

  if (accessToken) {
    return true;
  }

  void router.navigate([NAVIGATION_ROUTES.AUTH.LOGIN], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};
