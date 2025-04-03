import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category.model';
import { Page, PageRequest } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly baseUrl = `${environment.apiBaseUrl}${environment.categories.baseEndpoint}`;

  constructor(private http: HttpClient) { }

  getCategories(pageRequest: PageRequest): Observable<Page<Category>> {
    let params = new HttpParams()
      .set('page', pageRequest.page.toString())
      .set('size', pageRequest.size.toString());

    if (pageRequest.sort) {
      params = params.set('sort', pageRequest.sort);
    }

    return this.http.get<Page<Category>>(this.baseUrl, { params });
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  createCategory(category: CreateCategoryDto): Observable<Category> {
    if (!this.validateCategory(category)) {
      throw new Error('Categoria inválida');
    }
    return this.http.post<Category>(this.baseUrl, category);
  }

  updateCategory(id: number, category: UpdateCategoryDto): Observable<Category> {
    if (!this.validateCategory(category)) {
      throw new Error('Categoria inválida');
    }
    return this.http.put<Category>(`${this.baseUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private validateCategory(category: CreateCategoryDto | UpdateCategoryDto): boolean {
    if (!category.name || category.name.length > 100) {
      console.error('Nome da categoria inválido');
      return false;
    }

    if (category.description && category.description.length > 255) {
      console.error('Descrição da categoria inválida');
      return false;
    }

    return true;
  }
}