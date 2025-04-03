import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';
import { Page, PageRequest } from '../models/page.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiBaseUrl + environment.users.baseEndpoint;

  constructor(private http: HttpClient) {}

  getUsers(pageRequest: PageRequest): Observable<Page<User>> {
    let params = new HttpParams()
      .set('page', pageRequest.page.toString())
      .set('size', pageRequest.size.toString());

    if (pageRequest.sort) {
      params = params.set('sort', pageRequest.sort);
    }

    return this.http.get<Page<User>>(this.apiUrl, { params }).pipe(
      map(response => ({
        ...response,
        content: response.content.map(user => ({
          ...user,
          active: Boolean(user.active)
        }))
      }))
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      map(user => ({
        ...user,
        active: Boolean(user.active)
      }))
    );
  }

  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      map(user => ({
        ...user,
        active: Boolean(user.active)
      }))
    );
  }

  updateUser(id: number, user: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      map(user => ({
        ...user,
        active: Boolean(user.active)
      }))
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
