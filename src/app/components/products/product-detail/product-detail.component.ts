import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  product?: Product;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.productId) {
      this.router.navigate(['/products']);
      return;
    }

    this.loadProduct();
  }

  private loadProduct(): void {
    this.loading = true;
    this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar produto', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  deleteProduct(): void {
    if (!this.product) return;

    if (confirm(`Tem certeza que deseja excluir o produto ${this.product.name}?`)) {
      this.loading = true;
      this.productService.deleteProduct(this.productId).subscribe({
        next: () => {
          this.snackBar.open('Produto excluído com sucesso', 'Fechar', { duration: 3000 });
          this.router.navigate(['/products']);
        },
        error: () => {
          this.snackBar.open('Erro ao excluir produto', 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  onEdit(): void {
    this.router.navigate(['/products/edit', this.productId]);
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }
}