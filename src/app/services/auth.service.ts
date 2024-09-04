

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://localhost:3000'; // כתובת השרת שלך
  private tokenKey = 'jwtToken'; // הגדרת המאפיין tokenKey

  constructor(private http: HttpClient) {
    this.loadJwt(); // טען את הטוקן בעת יצירת השירות
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem(this.tokenKey);
    }
    return null;
  }
  
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      tap(response => this.handleAuthentication(response)),
      catchError(this.handleError)
    );
  }
  login(user: Partial<User>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        this.handleAuthentication(response);
      }),
      catchError(this.handleError)
    );
  }



  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 404 && error.error.message === 'User not found') {
        return throwError(() => new Error('User not found'));
    } else if (error.status === 401) {
        return throwError(() => new Error('שם משתמש או סיסמה שגויים, נסה שוב.'));
    }
    return throwError(() => new Error('שגיאה לא ידועה.'));
}



  
  private handleAuthentication(response: any): void {
    if (response.token) {
      this.saveToken(response.token);
      this.isAuthenticatedSubject.next(true);
    }
  }

  saveToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }



  loadJwt(): void {
    const token = this.getToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }
}


