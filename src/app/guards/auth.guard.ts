import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // שנה את הנתיב לפי הצורך

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/login']); // הפנה לדף התחברות אם המשתמש לא מחובר
      return false;
    }
  }
}
