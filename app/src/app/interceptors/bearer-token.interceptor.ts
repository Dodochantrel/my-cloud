import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const BearerTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
    const accessToken = cookieService.get('accessToken');

  if (accessToken) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
