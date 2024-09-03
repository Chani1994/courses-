import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories'; // URL ל-API של הקטגוריות

  constructor(private http: HttpClient) {}

  // קבלת כל הקטגוריות
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap(categories => {
        if (categories.length === 0) {
          // הוספה לשרת אם אין קטגוריות - התאמה לפי הצורך
          this.addDefaultCategories();
        }
      }),
      catchError(this.handleError<Category[]>('getCategories', []))
    );
  }

  // פונקציה להוספת קטגוריות ברירת מחדל
  private addDefaultCategories() {
    const defaultCategories: Category[] = [
      { code: '001', name: 'הוראה', iconPath: 'assets/images/teach-1968076_1280.jpg' },
      { code: '002', name: 'יצירה ואומנות', iconPath: 'assets/images/hand-4752642_1280.jpg' },
      { code: '003', name: 'מחשבים', iconPath: 'assets/images/pexels-pixabay-38568.jpg' },
      { code: '004', name: 'רפואה', iconPath: 'assets/images/syringes-3539565_1280.jpg' },

      // הוסף קטגוריות נוספות לפי הצורך
    ];
    
    defaultCategories.forEach(category => {
      this.addCategory(category).subscribe(); // הוספה של כל קטגוריה ברירת מחדל
    });
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

