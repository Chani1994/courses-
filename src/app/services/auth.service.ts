
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError, tap, map, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private authenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private apiUrl = 'http://localhost:3000'; // Address of your server
  private tokenKey = 'jwtToken'; // Token key
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  
  public username$: Observable<string | null>;
  public firstLetter$: Observable<string | null>;
  
  constructor(
    private http: HttpClient, 
    public userService: UserService,
    private router: Router,
  ) {
    this.loadJwt();
    this.loadCurrentUser();
    this.username$ = this.userService.getCurrentUser().pipe(
      map(user => user?.username || null)
    );
    this.firstLetter$ = this.username$.pipe(map(username => username ? username[0] : null));
  }

  loadCurrentUser(): void {
    if (this.isBrowser()) {
      const userString = sessionStorage.getItem('currentUser');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          this.currentUserSubject.next(user); // Store the entire user object
        } catch (error) {
          console.error('Error parsing user from sessionStorage:', error);
          this.currentUserSubject.next(null);
        }
      } else {
        this.currentUserSubject.next(null);
      }
    }
  }

  
  updateUser(user: User): void { // Update to accept User object
    this.currentUserSubject.next(user);
    if (this.isBrowser()) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return sessionStorage.getItem(this.tokenKey);
    }
    return null;
  }
  saveCurrentUser(user: User) {
    this.currentUserSubject.next(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user)); 
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
 

  getCurrentUser() {
    // החזרת המשתמש הנוכחי (כפי שאתה שומר אותו)
    return this.currentUserSubject.value;
  }

  refreshCurrentUser() {
    const user = this.getCurrentUser();
    console.log('Current User:', user);
    this.currentUserSubject.next(user);
  }
  
  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        this.handleAuthentication(response);
        this.onLoginSuccess(); // קריאה לפונקציה על התחברות מוצלחת
      }),
      catchError(error => {
        console.error('Login error', error);
  
        if (error.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'שגיאת כניסה',
            text: 'שם משתמש או סיסמה שגויים. אנא נסה שוב.',
            confirmButtonText: 'אוקי'
          });
          return throwError('Invalid username or password. Please try again.');
        } else if (error.status === 404) {
          Swal.fire({
            icon: 'info',
            title: 'משתמש לא נמצא',
            text: 'מעבר לרישום...',
            confirmButtonText: 'אוקי'
          }).then(() => {
            this.router.navigate(['/register'], { queryParams: { username } });
          });
          return throwError('User not found. Redirecting to registration.');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'שגיאה',
            text: 'משהו השתבש; אנא נסה שוב מאוחר יותר.',
            confirmButtonText: 'אוקי'
          });
          return throwError('Something went wrong; please try again later.');
        }
      })
    );
  }
  
 
  private handleAuthentication(response: any): void {
    const token = response.token;
    const user = response.user;
    if (this.isBrowser() && token) {
      sessionStorage.setItem(this.tokenKey, token);
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(user); // Store user data
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  saveToken(token: string): void {
    if (this.isBrowser()) {
      sessionStorage.setItem(this.tokenKey, token);
    }
  }

  logout(): void {
    // נניח שאתה שומר את ה-token ב-localStorage
    localStorage.removeItem('token'); // או כל מידע אחר
    this.isAuthenticatedSubject.next(false); // עדכון הסטטוס
    this.currentUserSubject.next(null); // נקה את המשתמש הנוכחי
    this.authenticatedSubject.next(false); // Clear authenticated state
  }


  private hasToken(): boolean {
    return !!this.getToken();
  }

  loadJwt(): void {
    if (this.isBrowser()) {
      const token = this.getToken();
      if (token) {
        this.isAuthenticatedSubject.next(true);
      }
    }
  }
  private onLoginSuccess(): void {
    // Perform any additional logic needed on successful login
    console.log('Login successful!');
    // Add additional actions here if needed
  }
  // getFirstLetterOfUsername(): Observable<string | null> {
  //   return this.userService.getCurrentUser().pipe(
  //     map(user => {
  //       const firstLetter = user ? user.username.charAt(0).toUpperCase() : null;
  //       console.log('First letter:', firstLetter); // ניפוי שגיאות
  //       return firstLetter;
  //     }),
  //     catchError(() => of(null))
  //   );
  // }
}



// // auth.service.ts
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of, catchError, throwError, tap, map } from 'rxjs';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { User } from '../models/user.model';
// import { UserService } from './user.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
//   private apiUrl = 'http://localhost:3000'; 
//   private tokenKey = 'jwtToken'; 

//   constructor(private http: HttpClient, private userService: UserService) {
//     this.loadJwt(); 
//   }

//   getToken(): string | null {
//     return sessionStorage.getItem(this.tokenKey);
//   }
  
//   isAuthenticated(): boolean {
//     return this.isAuthenticatedSubject.value;
//   }

//   get isAuthenticated$(): Observable<boolean> {
//     return this.isAuthenticatedSubject.asObservable();
//   }

//   register(user: any): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
//       tap(response => this.handleAuthentication(response)),
//       catchError(this.handleError)
//     );
//   }
  
//   login(user: Partial<User>): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
//       tap(response => {
//         this.handleAuthentication(response);
//       }),
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: HttpErrorResponse): Observable<never> {
//     if (error.status === 404 && error.error.message === 'User not found') {
//         return throwError(() => new Error('User not found'));
//     } else if (error.status === 401) {
//         return throwError(() => new Error('Incorrect username or password, please try again.'));
//     }
//     return throwError(() => new Error('Unknown error.'));
//   }

//   private handleAuthentication(response: any): void {
//     if (response.token) {
//       this.saveToken(response.token);
//       this.isAuthenticatedSubject.next(true);
//     }
//   }

//   saveToken(token: string): void {
//     sessionStorage.setItem(this.tokenKey, token);
//   }

//   logout(): void {
//     sessionStorage.removeItem(this.tokenKey);
//     this.isAuthenticatedSubject.next(false);
//   }

//   private hasToken(): boolean {
//     return !!this.getToken();
//   }

//   loadJwt(): void {
//     const token = this.getToken();
//     if (token) {
//       this.isAuthenticatedSubject.next(true);
//     }
//   }

//   getFirstLetterOfUsername(): Observable<string | null> {
//     return this.userService.getCurrentUser().pipe(
//       map((user: User | null) => user ? user.username.charAt(0).toUpperCase() : null) // ציין את הסוג
//     );
//   }
// }


// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, catchError, throwError, tap } from 'rxjs';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { User } from '../models/user.model';
// import { UserService } from './user.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
//   private apiUrl = 'http://localhost:3000'; // כתובת השרת שלך
//   private tokenKey = 'jwtToken'; // הגדרת המאפיין tokenKey

//   constructor(private http: HttpClient, private userService: UserService) {
//     this.loadJwt(); // טען את הטוקן בעת יצירת השירות
//   }

//   getToken(): string | null {
//     if (typeof window !== 'undefined' && window.sessionStorage) {
//       return sessionStorage.getItem(this.tokenKey);
//     }
//     return null;
//   }
  
//   isAuthenticated(): boolean {
//     return this.isAuthenticatedSubject.value;
//   }

//   get isAuthenticated$(): Observable<boolean> {
//     return this.isAuthenticatedSubject.asObservable();
//   }

//   register(user: any): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
//       tap(response => this.handleAuthentication(response)),
//       catchError(this.handleError)
//     );
//   }
//   login(user: Partial<User>): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
//       tap(response => {
//         this.handleAuthentication(response);
//       }),
//       catchError(this.handleError)
//     );
//   }



//   private handleError(error: HttpErrorResponse): Observable<never> {
//     if (error.status === 404 && error.error.message === 'User not found') {
//         return throwError(() => new Error('User not found'));
//     } else if (error.status === 401) {
//         return throwError(() => new Error('Incorrect username or password, please try again.'));
//     }
//     return throwError(() => new Error('Unknown error.'));
// }



  
//   private handleAuthentication(response: any): void {
//     if (response.token) {
//       this.saveToken(response.token);
//       this.isAuthenticatedSubject.next(true);
//     }
//   }

//   saveToken(token: string): void {
//     sessionStorage.setItem(this.tokenKey, token);
//   }

//   logout(): void {
//     sessionStorage.removeItem(this.tokenKey);
//     this.isAuthenticatedSubject.next(false);
//   }

//   private hasToken(): boolean {
//     return !!this.getToken();
//   }



//   loadJwt(): void {
//     const token = this.getToken();
//     if (token) {
//       this.isAuthenticatedSubject.next(true);
//     }
//   }
//   getFirstLetterOfUsername(): string | null {
//     const currentUser = this.userService.getCurrentUser(); // נקרא מ-UserService
//     return currentUser ? currentUser.username.charAt(0).toUpperCase() : null;
//   }
// }


