import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UserContext } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userContextSubject = new BehaviorSubject<UserContext | null>(null);
  private isAdminSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Tentar carregar o contexto do usuário se houver token
    if (this.getToken()) {
      this.loadUserContext().subscribe();
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    const loginUrl = `${environment.apiBaseUrl}${environment.auth.baseEndpoint}${environment.auth.loginEndpoint}`;

    return this.http.post<any>(loginUrl, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            const tokenParts = response.token.split('.');
            if (tokenParts.length !== 3) {
              throw new Error('Token JWT inválido: deve ter 3 partes separadas por ponto');
            }

            try {
              const payload = JSON.parse(atob(tokenParts[1]));
              if (!payload.sub) {
                throw new Error('Token inválido: sub está ausente ou null');
              }

              localStorage.setItem('token', response.token);
              this.loadUserContext().subscribe();
            } catch (error) {
              throw new Error('Erro ao processar token');
            }
          } else {
            throw new Error('Resposta do login não contém token');
          }
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  loadUserContext(): Observable<UserContext> {
    const token = this.getToken();
    
    if (!token) {
      this.logout();
      return throwError(() => new Error('No token found'));
    }

    // Extrai o email do token JWT
    const payload = JSON.parse(atob(token!.split('.')[1]));
    const email = payload.sub;

    // Faz a requisição POST para /context com o email
    return this.http.post<UserContext>(
      `${environment.apiBaseUrl}${environment.auth.baseEndpoint}${environment.auth.contextEndpoint}`,
      { email }
    ).pipe(
      tap(context => {
        if (!context || !context.role) {
          this.logout();
          throw new Error('Invalid user context');
        }
        this.userContextSubject.next(context);
        this.isAdminSubject.next(context.role === 'ADMIN');
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userContextSubject.next(null);
    this.isAdminSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserContext(): Observable<UserContext | null> {
    return this.userContextSubject.asObservable();
  }

  isAdmin(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}${environment.auth.baseEndpoint}${environment.auth.changePasswordEndpoint}`, data);
  }
}
