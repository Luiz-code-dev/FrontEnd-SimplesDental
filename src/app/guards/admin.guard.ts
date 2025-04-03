import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserContext().pipe(
    map(user => {
      if (authService.isAdmin()) {
        return true;
      }
      
      router.navigate(['/products']);
      return false;
    })
  );
};
