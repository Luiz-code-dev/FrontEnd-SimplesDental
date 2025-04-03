import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UserService } from '../../../services/user.service';
import { User, UserRole } from '../../../models/user.model';
import { PermissionDirective } from '../../../directives/permission.directive';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatTooltipModule,
    PermissionDirective
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns = ['name', 'email', 'role', 'actions'];
  loading = false;
  UserRole = UserRole;
  
  // Paginação
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;
  sortField = 'name';
  sortDirection = 'asc';

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers({
      page: this.pageIndex,
      size: this.pageSize,
      sort: `${this.sortField},${this.sortDirection}`
    }).subscribe({
      next: (page) => {
        this.users = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar usuários', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  onSort(sort: Sort): void {
    this.sortField = sort.active;
    this.sortDirection = sort.direction || 'asc';
    this.loadUsers();
  }

  deleteUser(user: User): void {
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.email}?`)) {
      this.loading = true;
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.snackBar.open('Usuário excluído com sucesso', 'Fechar', { duration: 3000 });
          this.loadUsers();
        },
        error: () => {
          this.snackBar.open('Erro ao excluir usuário', 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}
