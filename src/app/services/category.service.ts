import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories';
  constructor(private http: HttpClient) {}

  // קבלת כל הקטגוריות
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(this.handleError<Category[]>('getCategories', []))
    );
  }
//קבלת קטגוריה לפי קוד קטגוריה
getCategoryByCode(categoryCode: string): Observable<Category> {
  const url = `${this.apiUrl}/${categoryCode}`; // ודא שהURL נכון
  return this.http.get<Category>(url);
}



  // הוספת קטגוריה חדשה
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      catchError(this.handleError<Category>('addCategory'))
    );
  }

  // עדכון קטגוריה קיימת
  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${category.code}`, category).pipe(
      catchError(this.handleError<Category>('updateCategory'))
    );
  }

  // מחיקת קטגוריה
  deleteCategory(code: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${code}`).pipe(
      catchError(this.handleError<void>('deleteCategory'))
    );
  }

  // טיפול בשגיאות
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

