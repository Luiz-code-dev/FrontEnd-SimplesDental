import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  constructor(
    private authService: AuthService,
    private permissionService: PermissionService
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): Observable<boolean> {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
  }
}