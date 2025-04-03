import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const DebugInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`🔍 [${req.method}] ${req.url}`);
  console.log('Headers:', req.headers.keys().map(key => `${key}: ${req.headers.get(key)}`));
  if (req.body) {
    console.log('Body:', req.body);
  }

  const startTime = Date.now();
  return next(req).pipe(
    tap({
      next: (event) => {
        const endTime = Date.now();
        console.log(`✅ [${req.method}] ${req.url} (${endTime - startTime}ms)`);
        console.log('Response:', event);
      },
      error: (error) => {
        const endTime = Date.now();
        console.error(`❌ [${req.method}] ${req.url} (${endTime - startTime}ms)`);
        console.error('Error:', error);
      }
    })
  );
};
