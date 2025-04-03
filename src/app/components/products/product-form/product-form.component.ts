import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product, CreateProductDto, UpdateProductDto } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { Page, PageRequest } from '../../../models/page.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  loading = false;
  isEditMode = false;
  productId?: number;
  categories$: Observable<Category[]>;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, [Validators.required]]
    });

    // Buscar todas as categorias usando paginação
    const pageRequest: PageRequest = {
      page: 0,
      size: 100,
      sort: 'name,asc'
    };

    this.categories$ = this.categoryService.getCategories(pageRequest).pipe(
      map((page: Page<Category>) => page.content)
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.category.id
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produto:', error);
        this.snackBar.open('Erro ao carregar produto', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.loading = true;
      const formData = this.productForm.value;

      const productDto: CreateProductDto = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: {
          id: formData.categoryId
        }
      };

      if (this.isEditMode && this.productId) {
        this.productService.updateProduct(this.productId, productDto).subscribe({
          next: () => {
            this.snackBar.open('Produto atualizado com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/products']);
          },
          error: (error) => {
            console.error('Erro ao atualizar produto:', error);
            this.snackBar.open('Erro ao atualizar produto', 'Fechar', { duration: 3000 });
            this.loading = false;
          }
        });
      } else {
        this.productService.createProduct(productDto).subscribe({
          next: () => {
            this.snackBar.open('Produto criado com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/products']);
          },
          error: (error) => {
            console.error('Erro ao criar produto:', error);
            this.snackBar.open('Erro ao criar produto', 'Fechar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  private handleSuccess(action: string): void {
    this.snackBar.open(`Produto ${action} com sucesso`, 'Fechar', { duration: 3000 });
    this.router.navigate(['/products']);
  }

  private handleError(error: any): void {
    const message = error.error?.message || `Erro ao salvar produto`;
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
    this.loading = false;
  }

  getErrorMessage(field: string): string {
    const control = this.productForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (control.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Máximo de ${maxLength} caracteres`;
    }
    if (control.hasError('min')) {
      return 'O valor deve ser maior que 0';
    }
    return '';
  }
}