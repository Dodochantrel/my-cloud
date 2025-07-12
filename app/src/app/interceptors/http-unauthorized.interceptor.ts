import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CookieService } from '../services/cookie.service';
import { UserService } from '../services/user.service';

export const HttpUnauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);
  const userService = inject(UserService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/authentications')) {
        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            const newAccessToken = cookieService.get('accessToken');
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            userService.getMe(); // Met à jour les données de l'utilisateur après le rafraîchissement du token
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
