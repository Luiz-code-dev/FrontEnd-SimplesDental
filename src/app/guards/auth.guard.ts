import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserContext().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
