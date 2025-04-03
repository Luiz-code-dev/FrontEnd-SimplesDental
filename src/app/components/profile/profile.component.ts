import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { UserContext } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ]
})
export class ProfileComponent implements OnInit {
  user: UserContext | null = null;
  loading = false;
  profileForm: FormGroup;
  changePasswordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: ['']
    });

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.authService.getUserContext().subscribe({
      next: (user) => {
        this.user = user;
        if (user) {
          this.profileForm.patchValue({
            email: user.email,
            firstName: user.firstName || '',
            lastName: user.lastName || ''
          });
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading user profile:', error);
        this.snackBar.open('Erro ao carregar perfil', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loading = false;
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      // Implement profile update logic here
      this.loading = false;
    }
  }

  onChangePassword(): void {
    if (this.changePasswordForm.valid) {
      this.loading = true;
      const { currentPassword, newPassword } = this.changePasswordForm.value;

      this.authService.changePassword({ currentPassword, newPassword }).subscribe({
        next: () => {
          this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.changePasswordForm.reset();
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error changing password:', error);
          this.snackBar.open('Erro ao alterar senha', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.loading = false;
        }
      });
    }
  }

  getErrorMessage(field: string): string {
    const form = field.includes('Password') ? this.changePasswordForm : this.profileForm;
    const control = form.get(field);
    
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (control.hasError('email')) {
      return 'Email inválido';
    }
    if (control.hasError('minlength')) {
      return 'Mínimo de 6 caracteres';
    }
    if (control.hasError('mismatch')) {
      return 'As senhas não conferem';
    }
    return '';
  }
}
