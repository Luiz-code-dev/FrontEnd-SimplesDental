import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { UserService } from '../../../services/user.service';
import { UserRole } from '../../../models/user.model';

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
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      role: [UserRole.USER, Validators.required]
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
          email: user.email,
          role: user.role
        });
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading user', 'Close', { duration: 3000 });
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      const userData = this.userForm.value;
      const userId = this.route.snapshot.paramMap.get('id');

      const operation = userId
        ? this.userService.updateUser(+userId, userData)
        : this.userService.createUser(userData);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `User ${userId ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/users']);
        },
        error: (error) => {
          const message = error.error?.message || `Error ${userId ? 'updating' : 'creating'} user`;
          this.snackBar.open(message, 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}
