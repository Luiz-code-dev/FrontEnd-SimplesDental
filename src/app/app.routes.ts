import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/login');
};

const loginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return router.parseUrl('/products');
  }

  return true;
};

const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  return authService.isAdmin().subscribe(isAdmin => {
    if (!isAdmin) {
      return router.parseUrl('/products');
    }
    return true;
  });
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./components/auth/login/login.routes').then(m => m.LOGIN_ROUTES),
    canActivate: [loginGuard]
  },
  {
    path: 'products',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/products/product-list/product-list.component').then(m => m.ProductListComponent),
        canActivate: [authGuard]
      },
      {
        path: 'new',
        loadComponent: () => import('./components/products/product-form/product-form.component').then(m => m.ProductFormComponent),
        canActivate: [adminGuard]
      },
      {
        path: ':id',
        loadComponent: () => import('./components/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        canActivate: [authGuard]
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./components/products/product-form/product-form.component').then(m => m.ProductFormComponent),
        canActivate: [adminGuard]
      }
    ]
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/categories/category-list/category-list.component').then(m => m.CategoryListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./components/categories/category-form/category-form.component').then(m => m.CategoryFormComponent),
        canActivate: [adminGuard]
      },
      {
        path: ':id',
        loadComponent: () => import('./components/categories/category-detail/category-detail.component').then(m => m.CategoryDetailComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./components/categories/category-form/category-form.component').then(m => m.CategoryFormComponent),
        canActivate: [adminGuard]
      }
    ]
  },
  {
    path: 'users',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/users/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./components/users/user-form/user-form.component').then(m => m.UserFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/users/user-form/user-form.component').then(m => m.UserFormComponent)
      }
    ]
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  },
  { path: '**', redirectTo: 'products' }
];