import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private authService: AuthService) {}

  isAdmin(): Observable<boolean> {
    return this.authService.isAdmin();
  }

  hasPermission(requiredRole: UserRole): Observable<boolean> {
    return this.authService.getUserContext().pipe(
      map(user => {
        if (!user) return false;
        return user.role === requiredRole;
      })
    );
  }
}
