import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Product, CreateProductDto, UpdateProductDto } from '../models/product.model';
import { Page, PageRequest } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = `${environment.apiBaseUrl}${environment.products.baseEndpoint}`;

  constructor(private http: HttpClient) {}

  getProducts(pageRequest: PageRequest): Observable<Page<Product>> {
    let params = new HttpParams()
      .set('page', pageRequest.page.toString())
      .set('size', pageRequest.size.toString());

    if (pageRequest.sort) {
      params = params.set('sort', pageRequest.sort);
    }

    return this.http.get<Page<Product>>(this.baseUrl, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    if (!this.validateProduct(product)) {
      throw new Error('Produto inválido');
    }
    return this.http.post<Product>(this.baseUrl, product);
  }

  updateProduct(id: number, product: UpdateProductDto): Observable<Product> {
    if (!this.validateProduct(product)) {
      throw new Error('Produto inválido');
    }
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private validateProduct(product: CreateProductDto | UpdateProductDto): boolean {
    if (!product.name || product.name.length > 100) {
      throw new Error('Nome do produto inválido');
    }

    if (!product.description || product.description.length > 255) {
      throw new Error('Descrição do produto inválida');
    }

    if (!product.price || product.price <= 0) {
      throw new Error('Preço do produto inválido');
    }

    if (!product.category || !product.category.id) {
      throw new Error('Categoria do produto inválida');
    }

    return true;
  }
}