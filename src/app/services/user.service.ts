import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, catchError, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private apiUrl = 'http://localhost:3000/users'; // כתובת ה-API שלך
//   private currentUserKey = 'currentUser';

//   constructor(private http: HttpClient) {}

//   saveCurrentUser(user: User): void {
//     sessionStorage.setItem(this.currentUserKey, JSON.stringify(user));
//   }
  
  
//   // קבלת פרטי המשתמש מ-sessionStorage
//   getCurrentUser(): User | null {
//     const userString = sessionStorage.getItem(this.currentUserKey);
//     if (userString) {
//       try {
//         return JSON.parse(userString);
//       } catch (error) {
//         console.error('Error parsing user from sessionStorage:', error);
//         return null;
//       }
//     }
//     return null;
//   }

//   logout(): void {
//     sessionStorage.removeItem(this.currentUserKey);
//   }
//   getUserByUsername(username: string): Observable<User | null> {
//     const encodedUsername = encodeURIComponent(username); // מקודד את השם במקרה של תווים מיוחדים
//     return this.http.get<User>(`http://localhost:3000/users/${encodedUsername}`).pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.error('Error fetching user details:', error);
//         return throwError(error);
//       })
//     );
//   }
  
  
//   // getUserByUsername(username: string): Observable<User | null> {
//   //   const encodedUsername = encodeURIComponent(username);
//   //   return this.http.get<User>(`${this.apiUrl}/${encodedUsername}`).pipe(
//   //     catchError((error: HttpErrorResponse) => {
//   //       console.error('Error fetching user:', error);
//   //       return of(null); // Return null or handle the error as needed
//   //     })
//   //   );
//   // }
  
  

//   userExists(username: string): Observable<boolean> {
//     return this.http.get<boolean>(`${this.apiUrl}/exists/${username}`);
//   }

//   addUser(user: User): Observable<User> {
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//     return this.http.post<User>(this.apiUrl, user, { headers });

//   }
// }
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users'; // כתובת ה-API שלך

  constructor(private http: HttpClient) {}

  saveCurrentUser(user: User): void {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const userString = sessionStorage.getItem('currentUser');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user from sessionStorage:', error);
        return null;
      }
    }
    return null;
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
  }

  // getUserByUsername(username: string): Observable<User | null> {
  //   const encodedUsername = encodeURIComponent(username); // מקודד את השם במקרה של תווים מיוחדים
  //   return this.http.get<User>(`${this.apiUrl}/${encodedUsername}`).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       console.error('Error fetching user details:', error);
  //       return throwError(error);
  //     })
  //   );
  // }
  // getUserByUsername(username: string): Observable<User | null> {
  //   const encodedUsername = encodeURIComponent(username); // מקודד את השם במקרה של תווים מיוחדים
  //   return this.http.get<User>(`${this.apiUrl}/${encodedUsername}`).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       if (error.status === 404) {
  //         return of(null);  // מחזיר null אם המשתמש לא נמצא
  //       }
  //       console.error('Error fetching user details:', error);
  //       return throwError(error);
  //     })
  //   );
  // }
  getUserByUsername(username: string): Observable<User | null> {
    const url = `${this.apiUrl}/${encodeURIComponent(username)}`;
    return this.http.get<User | null>(url).pipe(
      catchError(error => {
        console.error('Error fetching user by username:', error);
        return of(null); // Return null if user not found
      })
    );
  }
  
  addUser(user: User): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding user:', error);
        return throwError(error);
      })
    );
  }
}
