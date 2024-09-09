
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}



login(): void {
  this.errorMessage = ''; // לנקות הודעות שגיאה קודמות

  this.authService.login(this.username, this.password).subscribe(
    (response: any) => {
      if (response && response.token) {
        sessionStorage.setItem('jwtToken', response.token);
        this.authService.loadJwt();

        this.userService.getUserByUsername(this.username).subscribe(
          (user: User | null) => {
            if (user) {
              this.authService.saveCurrentUser(user);
              this.userService.saveCurrentUser(user);
              Swal.fire({
                icon: 'success',
                title: 'Successfully connected!',
                text: 'Welcome!',
                confirmButtonText: 'אוקי'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/all-courses']);
                }
              });
            } else {
              this.router.navigate(['/register'], { queryParams: { username: this.username } });
            }
          },
          (error) => {
            console.error('שגיאה בקבלת פרטי המשתמש:', error);
            this.router.navigate(['/register'], { queryParams: { username: this.username } });
          }
        );
      } else {
        console.error('הכניסה נכשלה: אין טוקן');
        this.errorMessage = 'אירעה שגיאה במהלך התחברות.';
        Swal.fire({
          icon: 'error',
          title: 'שגיאה',
          text: this.errorMessage,
          confirmButtonText: 'אוקי'
        });
      }
    },
    (error) => {
      console.error('שגיאת כניסה:', error);
    }
  );
}


handleUserNotFound(error?: any): void {
    console.error('משתמש לא נמצא או שגיאה בקבלת המשתמש:', error);
    this.errorMessage = 'אירעה שגיאה במהלך קבלת פרטי המשתמש.';
    Swal.fire('שגיאה', this.errorMessage, 'error');
    this.router.navigate(['/register']);
}


  registerLecturer(): void {
    this.router.navigate(['/register'], { queryParams: { courseName: 'courseName', isLecturer: true } });
  }

  private showErrorAlert(message: string): void {
    Swal.fire('שגיאה', message, 'error').then(() => {
      this.username = '';
      this.password = '';
    });
  }
}
