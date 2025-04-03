import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User, UserRole, UpdateUserDto } from '../../../models/user.model';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  isEdit = false;
  UserRole = UserRole;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      role: [UserRole.USER, Validators.required],
      active: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.isEdit = true;
      this.loadUser(+userId);
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  private loadUser(id: number): void {
    this.loading = true;
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          active: user.active
        });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar usuário', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      const userData: UpdateUserDto = {
        firstName: this.userForm.get('firstName')?.value,
        lastName: this.userForm.get('lastName')?.value,
        email: this.userForm.get('email')?.value,
        role: this.userForm.get('role')?.value
      };

      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.userService.updateUser(id, userData).subscribe({
          next: () => {
            this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/users']);
          },
          error: (error) => {
            let message = 'Erro ao atualizar usuário';
            if (error.status === 400) {
              if (error.error?.message?.includes('email')) {
                message = 'Este e-mail já está em uso';
              } else if (error.error?.message?.includes('admin')) {
                message = 'Não é possível alterar o último administrador para usuário comum';
              }
            } else if (error.status === 403) {
              message = 'Você não tem permissão para atualizar usuários';
            } else if (error.status === 404) {
              message = 'Usuário não encontrado';
            }
            this.snackBar.open(message, 'Fechar', { duration: 3000 });
          },
          complete: () => {
            this.loading = false;
          }
        });
      }
    }
  }
}
