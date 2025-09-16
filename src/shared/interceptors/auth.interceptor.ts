import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AUTH_FORGOT_PASSWORD_URL, AUTH_LOGIN_URL, AUTH_REFRESH_TOKEN_URL, AUTH_RESET_PASSWORD_URL } from '@shared/constants/api.constants';
import { NAVIGATION_ROUTES } from '@shared/constants/navigation.constant';
import { AuthService } from '@shared/services/auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

const WHITE_LISTED_URLS = [
    AUTH_LOGIN_URL,
    AUTH_FORGOT_PASSWORD_URL,
    AUTH_RESET_PASSWORD_URL,
    AUTH_REFRESH_TOKEN_URL,
]

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const accessToken = authService.getAccessToken();

    // Skip adding token for whitelisted URLs
    const shouldSkip = WHITE_LISTED_URLS.some(url => req.url.includes(url));

    let authReq = req;
    if (accessToken && !shouldSkip) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Handle 401 errors and attempt token refresh
            if (
                error.status === 401 &&
                !req.url.includes(AUTH_REFRESH_TOKEN_URL)
            ) {
                return authService.refreshToken().pipe(
                    switchMap((response: { token: string }) => {
                        authService.setAccessToken(response.token);

                        // Retry the original request with new token
                        const retryReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${response.token}`
                            }
                        });

                        return next(retryReq);
                    }),
                    catchError(() => {
                        // If refresh fails, re-route to login
                        router.navigateByUrl(NAVIGATION_ROUTES.AUTH.LOGIN);

                        return throwError(() => error);
                    })
                );
            }

            return throwError(() => error);
        })
    );
};
