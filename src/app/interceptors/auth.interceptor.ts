import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!req.url.includes('/authenticate')) {
    if (token) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          handleAuthError(router);
          return throwError(() => new Error('Token inválido'));
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        if (!payload.sub) {
          handleAuthError(router);
          return throwError(() => new Error('Token sem subject'));
        }

        let headers = req.headers
          .set('Authorization', `Bearer ${token}`);
          
        if (!(req.body instanceof FormData)) {
          headers = headers.set('Content-Type', 'application/json');
        }
          
        req = req.clone({ headers });
      } catch (error) {
        handleAuthError(router);
        return throwError(() => error);
      }
    } else {
      handleAuthError(router);
      return throwError(() => new Error('Token não encontrado'));
    }
  }

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          // Resposta bem sucedida
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        handleAuthError(router);
      }
      return throwError(() => error);
    })
  );
};

function handleAuthError(router: Router): void {
  localStorage.removeItem('token');
  router.navigate(['/login']);
}
