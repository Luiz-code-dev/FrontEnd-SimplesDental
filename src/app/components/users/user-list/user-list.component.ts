import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User, UserRole, UpdateUserDto } from '../../../models/user.model';
import { PermissionDirective } from '../../../directives/permission.directive';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    RouterModule,
    MatSnackBarModule,
    PermissionDirective
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'status', 'actions'];
  loading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  sortField = 'firstName';
  sortDirection = 'asc';
  UserRole = UserRole;
  Boolean = Boolean;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
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
      next: (response) => {
        this.users = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
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

  onSort(event: Sort): void {
    this.sortField = event.active === 'name' ? 'firstName' : event.active;
    this.sortDirection = event.direction || 'asc';
    this.loadUsers();
  }

  deleteUser(user: User): void {
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.firstName} ${user.lastName}?`)) {
      this.loading = true;
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', { duration: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          let message = 'Erro ao excluir usuário';
          if (error.status === 400) {
            message = 'Não é possível excluir o último usuário administrador';
          } else if (error.status === 403) {
            message = 'Você não tem permissão para excluir usuários';
          } else if (error.status === 404) {
            message = 'Usuário não encontrado';
          }
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  editUser(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }
}
