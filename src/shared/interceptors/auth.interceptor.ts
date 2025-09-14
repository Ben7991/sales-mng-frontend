import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { NAVIGATION_ROUTES } from '@shared/constants/navigation.constant';
import { AuthService } from '@shared/services/auth/auth.service';

const WHITE_LISTED_URLS = [
    NAVIGATION_ROUTES.AUTH.LOGIN,
    NAVIGATION_ROUTES.AUTH.CHANGE_PASSWORD,
    NAVIGATION_ROUTES.AUTH.FORGOT_PASSWORD,
]

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const { accessToken } = inject(AuthService);

    // Skip adding token for certain URLs (login, register, etc.)
    const shouldSkip = WHITE_LISTED_URLS.some(url => req.url.includes(url));

    if (accessToken && !shouldSkip) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return next(authReq);
    }

    // If no token or should skip, proceed with original request
    return next(req);
};
