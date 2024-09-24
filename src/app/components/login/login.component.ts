import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';


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
          // שמירת הטוקן
          sessionStorage.setItem('jwtToken', response.token);
          this.authService.loadJwt();
  
          // שליפת פרטי המשתמש
          this.userService.getUserByUsername(this.username).subscribe(
            (user: User | null) => {
              if (user) {
                this.authService.saveCurrentUser(user);
                this.userService.saveCurrentUser(user);
                
                // הצגת הודעת הצלחה עם SweetAlert
                Swal.fire({
                  icon: 'success',
                  title: 'Successfully connected!',
                  text: 'Welcome!',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.isConfirmed) {
                    // ניתוב לעמוד הקורסים
                    this.router.navigate(['/all-courses']);
                  }
                });
              } else {
                // במקרה שאין משתמש - ניתוב לרישום
                this.router.navigate(['/register'], { queryParams: { username: this.username, password: this.password } });
              }
            }
          );
        }
      }
    );
  }
  
handleUserNotFound(error?: any): void {
    // console.error('משתמש לא נמצא או שגיאה בקבלת המשתמש:', error);
    this.errorMessage ='An error occurred while receiving user information.';
    Swal.fire('Error', this.errorMessage, 'error');
    this.router.navigate(['/register']);
}


  registerLecturer(): void {
    this.router.navigate(['/register'], { queryParams: {  isLecturer: true } });
  }

  private showErrorAlert(message: string): void {
    Swal.fire('שגיאה', message, 'error').then(() => {
      this.username = '';
      this.password = '';
    });
  }
}
