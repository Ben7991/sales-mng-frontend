import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '@shared/services/auth/authentication.service';
import { NAVIGATION_ROUTES } from '@shared/constants/navigation.constant';
import { UserService } from '@shared/services/state/user/user.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const userService = inject(UserService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();

  if (!accessToken) {
    void router.navigate([NAVIGATION_ROUTES.AUTH.LOGIN], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // If we have a token but no user, fetch user details
  if (!userService.user) {
    return authService.fetchUserDetails().pipe(
      map(() => true),
      catchError(() => {
        authService.clearAuthData();
        void router.navigate([NAVIGATION_ROUTES.AUTH.LOGIN], {
          queryParams: { returnUrl: state.url }
        });
        return of(false);
      })
    );
  }

  return true;
};
