import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CookieService } from '../services/cookie.service';

export const HttpForbiddenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/refresh')) {
        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            const newAccessToken = cookieService.get('accessToken');
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            return next(clonedReq); // Rejoue la requête avec le nouveau token
          }),
          catchError(() => {
            router.navigate(['/auth/login']);
            return throwError(() => error);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
