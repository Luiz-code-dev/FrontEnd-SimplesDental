import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';

import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { Page, PageRequest } from '../../../models/page.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  loading = true;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  sortField = 'name';
  sortDirection = 'asc';
  isAdmin = false;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  loadCategories(): void {
    this.loading = true;
    
    const pageRequest: PageRequest = {
      page: this.pageIndex,
      size: this.pageSize,
      sort: `${this.sortField},${this.sortDirection}`
    };

    this.categoryService.getCategories(pageRequest).subscribe({
      next: (page: Page<Category>) => {
        this.categories = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar categorias', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCategories();
  }

  onSortChange(sort: Sort): void {
    this.sortField = sort.active;
    this.sortDirection = sort.direction || 'asc';
    this.loadCategories();
  }

  deleteCategory(id: number): void {
    if (this.isAdmin) {
      if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            this.snackBar.open('Categoria excluída com sucesso', 'Fechar', { duration: 3000 });
            this.loadCategories();
          },
          error: (error) => {
            this.snackBar.open('Erro ao excluir categoria', 'Fechar', { duration: 3000 });
          }
        });
      }
    } else {
      this.snackBar.open('Você não tem permissão para excluir categorias', 'Fechar', { duration: 3000 });
    }
  }
}