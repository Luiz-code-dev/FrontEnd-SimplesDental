import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  
  // Pegar o token do localStorage
  const token = localStorage.getItem('token');

  // Se não for uma requisição de autenticação, adiciona o token
  if (!request.url.includes('/authenticate')) {
    console.log('[AuthInterceptor] Processando requisição para:', request.url);
    
    if (token) {
      try {
        // Verificar se o token é válido
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('[AuthInterceptor] Token inválido: formato incorreto');
          localStorage.removeItem('token');
          router.navigate(['/login']);
          return throwError(() => new Error('Token inválido'));
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        if (!payload.sub) {
          console.error('[AuthInterceptor] Token inválido: sub está ausente ou null');
          localStorage.removeItem('token');
          router.navigate(['/login']);
          return throwError(() => new Error('Token inválido'));
        }
        
        // Token válido, adiciona no header
        let headers = request.headers
          .set('Authorization', `Bearer ${token}`);
          
        // Adiciona Content-Type se não for FormData
        if (!(request.body instanceof FormData)) {
          headers = headers.set('Content-Type', 'application/json');
        }
          
        request = request.clone({ headers });
        
        console.log('[AuthInterceptor] Headers da requisição:', {
          Authorization: headers.get('Authorization'),
          'Content-Type': headers.get('Content-Type')
        });
      } catch (error) {
        console.error('[AuthInterceptor] Erro ao processar token:', error);
        localStorage.removeItem('token');
        router.navigate(['/login']);
        return throwError(() => error);
      }
    } else {
      console.warn('[AuthInterceptor] Token não encontrado para requisição protegida:', request.url);
      router.navigate(['/login']);
      return throwError(() => new Error('Token não encontrado'));
    }
  }

  // Enviar a requisição e logar a resposta
  return next(request).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpErrorResponse) {
          console.error('[AuthInterceptor] Erro na resposta:', event);
        } else {
          console.log('[AuthInterceptor] Resposta bem sucedida:', event);
        }
      },
      error: (error) => {
        console.error('[AuthInterceptor] Erro na requisição:', error);
        if (error.status === 401 || error.status === 403) {
          console.error('[AuthInterceptor] Erro de autenticação:', error);
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
      }
    })
  );
};
