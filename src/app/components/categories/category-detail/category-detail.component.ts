import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  categoryId!: number;
  category: Category | null = null;
  loading = true;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.categoryId = +id;
      this.loadCategory();
      this.authService.isAdmin().subscribe(isAdmin => {
        this.isAdmin = isAdmin;
      });
    } else {
      this.router.navigate(['/categories']);
    }
  }

  loadCategory(): void {
    this.loading = true;
    this.categoryService.getCategory(this.categoryId).subscribe({
      next: (category: Category) => {
        this.category = category;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categoria:', error);
        this.snackBar.open('Erro ao carregar detalhes da categoria', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/categories']);
      }
    });
  }

  deleteCategory(): void {
    if (this.isAdmin) {
      if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        this.categoryService.deleteCategory(this.categoryId).subscribe({
          next: () => {
            this.snackBar.open('Categoria excluída com sucesso', 'Fechar', { duration: 3000 });
            this.router.navigate(['/categories']);
          },
          error: (error) => {
            console.error('Erro ao excluir categoria:', error);
            this.snackBar.open('Erro ao excluir categoria', 'Fechar', { duration: 3000 });
          }
        });
      }
    } else {
      this.snackBar.open('Você não tem permissão para excluir categorias', 'Fechar', { duration: 3000 });
    }
  }
}