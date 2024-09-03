
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
  // login(): void {
  //   this.errorMessage = ''; // ניקוי הודעת השגיאה בתחילת הפעולה
  
  //   this.authService.login({ username: this.username, password: this.password }).subscribe(
  //     (response: any) => {
  //       if (response && response.token) {
  //         // שמור את ה-JWT ב-sessionStorage
  //         sessionStorage.setItem('jwtToken', response.token);
  
  //         // טען מחדש את ה-JWT מיד לאחר השמירה
  //         this.authService.loadJwt(); // פונקציה זו תוודא שה-JWT נטען כראוי
  
  //         // המשך עם קבלת פרטי המשתמש והניווט
  //         this.userService.getUserByUsername(this.username).subscribe(
  //           (user: User | null) => {
  //             if (user) {
  //               this.userService.saveCurrentUser(user);
  //               Swal.fire({
  //                 icon: 'success',
  //                 title: 'התחברת בהצלחה!',
  //                 showConfirmButton: true,
  //               }).then(() => {
  //                 this.router.navigate(['/all-courses']);
  //               });
  //             } else {
  //               this.errorMessage = 'אירעה שגיאה במהלך קבלת פרטי המשתמש.';
  //               Swal.fire('שגיאה', this.errorMessage, 'error');
  //             }
  //           },
  //           (error) => {
  //             console.error('Error fetching user details:', error);
  //             this.errorMessage = 'אירעה שגיאה במהלך קבלת פרטי המשתמש.';
  //             Swal.fire('שגיאה', this.errorMessage, 'error');
  //           }
  //         );
  //       } else {
  //         this.errorMessage = 'אירעה שגיאה במהלך התחברות.';
  //         Swal.fire('שגיאה', this.errorMessage, 'error');
  //       }
  //     },
  //     (error) => {
  //       if (error.status === 404 && error.error.message === 'User not found') {
  //         this.router.navigate(['/register']); // הפנייה לדף ההרשמה
  //       } else {
  //         // טיפול בשגיאות אחרות
  //         this.errorMessage = 'אירעה שגיאה במהלך התחברות.';
  //         Swal.fire('שגיאה', this.errorMessage, 'error');
  //       }
  //     }
  //   );
  // }
  login(): void {
    console.log('מנסים להתחבר...');

    this.errorMessage = ''; // לנקות הודעות שגיאה קודמות

    // ניסיון להיכנס עם שם המשתמש והסיסמה הנתונים
    this.authService.login({ username: this.username, password: this.password }).subscribe(
        (response: any) => {
            if (response && response.token) {
                sessionStorage.setItem('jwtToken', response.token);
                this.authService.loadJwt();

                // קבלת פרטי המשתמש לאחר כניסה מוצלחת
                this.userService.getUserByUsername(this.username).subscribe(
                    (user: User | null) => {
                        if (user) {
                            this.userService.saveCurrentUser(user);
                            Swal.fire({
                              icon: 'success',
                              title: ' התחברת בהצלחה!',
                              text: 'ברוך הבא למערכת!',
                              confirmButtonText: 'אוקי'
                          }).then((result) => {
                              if (result.isConfirmed) {
                                  // העבר לקומפוננטת כל הקורסים
                                  this.router.navigate(['/all-courses']);
                              }
                          });
                        } else {
                            this.handleUserNotFound();
                        }
                    },
                    (error) => {
                        console.error('שגיאה בקבלת פרטי המשתמש:', error);
                        this.handleUserNotFound(error);
                    }
                );
            } else {
                console.error('הכניסה נכשלה: אין טוקן');
                this.errorMessage = 'אירעה שגיאה במהלך התחברות.';
            }
        },
     
        (error) => {
          console.error('שגיאת כניסה:', error); // הדפס את השגיאה
          if (error.message === 'User not found') {
              this.router.navigate(['/register'], { queryParams: { username: this.username } });
          } else {
              this.errorMessage = error.message; // השתמש בהודעת השגיאה
          }
      }
    );
}



handleUserNotFound(error?: any): void {
    console.error('משתמש לא נמצא או שגיאה בקבלת המשתמש:', error);
    this.errorMessage = 'אירעה שגיאה במהלך קבלת פרטי המשתמש.';
    Swal.fire('שגיאה', this.errorMessage, 'error');
    this.router.navigate(['/register']);
}

// login(): void {
//   this.errorMessage = ''; // ניקוי הודעת השגיאה בתחילת הפעולה

//   this.authService.login({ username: this.username, password: this.password }).subscribe(
//     (response: any) => {
//       if (response && response.token) {
//         // שמור את ה-JWT ב-sessionStorage
//         sessionStorage.setItem('jwtToken', response.token);

//         // טען מחדש את ה-JWT מיד לאחר השמירה
//         this.authService.loadJwt(); // פונקציה זו תוודא שה-JWT נטען כראוי

//         // המשך עם קבלת פרטי המשתמש והניווט
//         this.userService.getUserByUsername(this.username).subscribe(
//           (user: User | null) => {
//             if (user) {
//               this.userService.saveCurrentUser(user);
//               Swal.fire({
//                 icon: 'success',
//                 title: 'התחברת בהצלחה!',
//                 showConfirmButton: true,
//               }).then(() => {
//                 this.router.navigate(['/all-courses']);
//               });
//             } else {
//               this.errorMessage = 'אירעה שגיאה במהלך קבלת פרטי המשתמש.';
//               Swal.fire('שגיאה', this.errorMessage, 'error');
//             }
//           },
//           (error) => {
//             console.error('Error fetching user details:', error);
//             this.errorMessage = 'אירעה שגיאה במהלך קבלת פרטי המשתמש.';
//             Swal.fire('שגיאה', this.errorMessage, 'error');
//           }
//         );
//       } else {
//         this.errorMessage = 'אירעה שגיאה במהלך התחברות.';
//         Swal.fire('שגיאה', this.errorMessage, 'error');
//       }
//     },
//     (error) => {
//       if (error.status === 401) {
//         this.errorMessage = 'שם המשתמש או הסיסמה שגויים. נסה שנית.';
//         Swal.fire('שגיאה', this.errorMessage, 'error');
//       } else if (error.status === 404) {
//         this.router.navigate(['/register'], { queryParams: { username: this.username } });
//       } else {
//         this.errorMessage = 'אירעה שגיאה במהלך התחברות. נסה שנית.';
//         Swal.fire('שגיאה', this.errorMessage, 'error');
//       }
//       console.error('Login error:', error);
//     }
//   );
// }

  registerLecturer(): void {
    this.router.navigate(['/register'], { queryParams: { courseName: 'שם הקורס', isLecturer: true } });
  }

  private showErrorAlert(message: string): void {
    Swal.fire('שגיאה', message, 'error').then(() => {
      this.username = '';
      this.password = '';
    });
  }
}
