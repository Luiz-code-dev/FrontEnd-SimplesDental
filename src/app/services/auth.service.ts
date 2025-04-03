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
    console.log('Iniciando login para:', credentials.email);
    const loginUrl = `${environment.apiBaseUrl}${environment.auth.baseEndpoint}${environment.auth.loginEndpoint}`;
    console.log('URL de login:', loginUrl);

    return this.http.post<any>(loginUrl, credentials)
      .pipe(
        tap(response => {
          console.log('Resposta completa do login:', response);
          
          if (response && response.token) {
            console.log('Token recebido:', response.token);
            
            // Validar formato do token
            const tokenParts = response.token.split('.');
            console.log('Número de partes do token:', tokenParts.length);
            
            if (tokenParts.length !== 3) {
              console.error('Token JWT inválido: deve ter 3 partes separadas por ponto. Encontrado:', tokenParts.length);
              throw new Error('Token JWT malformado');
            }

            try {
              // Decodificar cada parte do token
              console.log('Header:', JSON.parse(atob(tokenParts[0])));
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('Payload:', payload);
              
              if (!payload.sub) {
                console.error('Token inválido: sub está ausente ou null');
                throw new Error('Token sem subject (sub)');
              }

              localStorage.setItem('token', response.token);
              this.loadUserContext().subscribe();
            } catch (error) {
              console.error('Erro ao processar token:', error);
              throw error;
            }
          } else {
            console.error('Resposta do login não contém token:', response);
            throw new Error('Token não encontrado na resposta');
          }
        }),
        catchError(error => {
          console.error('Erro durante o login:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  loadUserContext(): Observable<UserContext> {
    console.log('[AuthService] Fetching user context...');
    const token = this.getToken();
    
    if (!token) {
      console.error('[AuthService] No token found, cannot fetch user context');
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
        console.log('[AuthService] User context received:', context);
        if (!context || !context.role) {
          console.error('[AuthService] Invalid user context received:', context);
          this.logout();
          throw new Error('Invalid user context');
        }
        this.userContextSubject.next(context);
        this.isAdminSubject.next(context.role === 'ADMIN');
      }),
      catchError(error => {
        console.error('[AuthService] Error fetching user context:', error);
        if (error.status === 400) {
          console.error('[AuthService] Bad request when fetching user context. Request details:', {
            url: `${environment.apiBaseUrl}${environment.auth.baseEndpoint}${environment.auth.contextEndpoint}`,
            headers: error.headers,
            error: error.error
          });
        }
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
