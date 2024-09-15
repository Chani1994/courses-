import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users'; // Address of your API
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCurrentUser(); // Load current user on service initialization
  }

  private loadCurrentUser(): void {
    this.getCurrentUser().subscribe(user => {
      this.currentUserSubject.next(user);
    });
  }

  saveCurrentUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
        sessionStorage.setItem('currentUser', JSON.stringify(user)); // שמירת המשתמש ב-sessionStorage
        this.currentUserSubject.next(user); // עדכון הסטייט של המשתמש
    }
}

  getCurrentUser(): Observable<User | null> {
    if (isPlatformBrowser(this.platformId)) {
      const userString = sessionStorage.getItem('currentUser');
      if (userString) {
        try {
          const user: User = JSON.parse(userString);
          if (this.isValidUser(user)) {
            return of(user);
          } else {
            console.error('Invalid user object in sessionStorage:', user);
            return of(null);
          }
        } catch (error) {
          console.error('Error parsing user from sessionStorage:', error);
          return of(null);
        }
      }
    }
    return of(null);
  }

  private isValidUser(user: any): user is User {
    return user && typeof user === 'object' && 'username' in user;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('currentUser');
      this.currentUserSubject.next(null); // Update the currentUserSubject to null
    }
  }

  getUserByUsername(username: string): Observable<User | null> {
    const url = `${this.apiUrl}/${encodeURIComponent(username)}`;
    return this.http.get<User | null>(url).pipe(
      catchError(error => {
        // console.error('Error fetching user by username:', error);
        return of(null); // Return null if user not found
      })
    );
  }

  addUser(user: User): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.error('Error adding user:', error);
        return throwError(error);
      })
    );
  }
}

