import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm!: FormGroup;
  categoryId: number | null = null;
  isEditMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.categoryId = +id;
      this.isEditMode = true;
      this.loadCategory(this.categoryId);
    }
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(255)]]
    });
  }

  loadCategory(id: number): void {
    this.loading = true;
    this.categoryService.getCategory(id).subscribe({
      next: (category: Category) => {
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categoria:', error);
        this.snackBar.open('Erro ao carregar categoria', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/categories']);
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.categoryForm.value;

    const categoryDto: CreateCategoryDto = {
      name: formData.name,
      description: formData.description
    };

    if (this.isEditMode && this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, categoryDto).subscribe({
        next: () => {
          this.snackBar.open('Categoria atualizada com sucesso', 'Fechar', { duration: 3000 });
          this.loading = false;
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Erro ao atualizar categoria:', error);
          this.snackBar.open('Erro ao atualizar categoria', 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.categoryService.createCategory(categoryDto).subscribe({
        next: () => {
          this.snackBar.open('Categoria criada com sucesso', 'Fechar', { duration: 3000 });
          this.loading = false;
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Erro ao criar categoria:', error);
          this.snackBar.open('Erro ao criar categoria', 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}