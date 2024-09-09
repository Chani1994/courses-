// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { UserService } from '../../services/user.service';
// import { LecturerService } from '../../services/lecturer.service';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { User } from '../../models/user.model';
// import Swal from 'sweetalert2';
// import { AuthService } from '../../services/auth.service';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [FormsModule, CommonModule,MatInputModule,
//     MatButtonModule,
//     MatFormFieldModule,],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.scss']
// })
// export class RegisterComponent implements OnInit {
//   userCode: string = ''; // קוד משתמש אוטומטי

//   username: string = '';
//   password: string = '';
//   email: string = '';
//   courseName: string = '';
//   isLecturerRegistration: boolean = false;
//   errorMessage: string = '';

//   constructor(
//     private userService: UserService,
//     private lecturerService: LecturerService,
//     private router: Router,
//     private route: ActivatedRoute,
//     private authService:AuthService
    
//   ) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       this.username = params['username'] || '';
//       this.courseName = params['courseName'] || '';
//       this.isLecturerRegistration = params['isLecturer'] === 'true';
//       this.generateUserCode(); // יצירת קוד אוטומטי

//     });
//   }
//   generateUserCode(): void {
//     this.userCode = 'USR-' + Math.floor(Math.random() * 10000).toString();
//   }
//   register(): void {
//     if (!this.username || !this.password || !this.email || (this.isLecturerRegistration && !this.courseName)) {
//       this.errorMessage = 'נא למלא את כל השדות הדרושים.';
//       return;
//     }
  
//     this.userService.getUserByUsername(this.username).subscribe(
//       user => {
//         if (user) {
//           this.errorMessage = 'משתמש קיים כבר!';
//           Swal.fire('שגיאה', this.errorMessage, 'error');
//         } else {
//           const newUser: User = {
//             username: this.username,
//             password: this.password,
//             email: this.email,
//             code: this.userCode,  // משתמש בקוד שנוצר
//           };
  
//           this.userService.addUser(newUser).subscribe(() => {
//             console.log('User added successfully');
            
//             // If it's a lecturer registration, add the lecturer
//             if (this.isLecturerRegistration) {
//               const newLecturer = {
//                 code: newUser.username,
//                 name: newUser.username,
//                 address: '',
//                 email: newUser.email,
//                 password: newUser.password,
//                 courseName: this.courseName
//               };
  
//               this.lecturerService.addLecturer(newLecturer, this.courseName).subscribe(() => {
//                 // Now log in the user
//                 this.authService.login({ username: this.username, password: this.password }).subscribe(
//                   () => {Swal.fire({
//                     icon: 'success',
//                     title: 'Registration was successfully completed!',
//                     text: 'Welcome!',
//                     confirmButtonText: 'אוקי'
//                 }).then((result) => {
//                     if (result.isConfirmed) {
//                         // העבר לקומפוננטת כל הקורסים
//                         this.router.navigate(['/all-courses']);
//                     }
//                 });
//                   },
//                   loginError => {
//                     console.error('Error logging in:', loginError);
//                     this.errorMessage = 'אירעה שגיאה במהלך ההתחברות.';
//                     Swal.fire('שגיאה', this.errorMessage, 'error');
//                   }
//                 );
//               }, error => {
//                 console.error('Error adding lecturer:', error);
//                 this.errorMessage = 'אירעה שגיאה במהלך הוספת המרצה.';
//                 Swal.fire('שגיאה', this.errorMessage, 'error');
//               });
//             } else {
//               // If it's not a lecturer registration, just log in the user
//               this.authService.login({ username: this.username, password: this.password }).subscribe(
//                 () => {  // הצגת הודעת הצלחה עם SweetAlert
//                   Swal.fire({
//                       icon: 'success',
//                       title: 'Registration was successfully completed!',
//                       text: 'Welcome!',
//                       confirmButtonText: 'אוקי'
//                   }).then((result) => {
//                       if (result.isConfirmed) {
//                           // העבר לקומפוננטת כל הקורסים
//                           this.router.navigate(['/all-courses']);
//                       }
//                   });
//                 },
//                 loginError => {
//                   console.error('Error logging in:', loginError);
//                   this.errorMessage = 'אירעה שגיאה במהלך ההתחברות.';
//                   Swal.fire('שגיאה', this.errorMessage, 'error');
//                 }
//               );
//             }
//           }, error => {
//             console.error('Error adding user:', error);
//             this.errorMessage = 'אירעה שגיאה במהלך הוספת המשתמש.';
//             Swal.fire('שגיאה', this.errorMessage, 'error');
//           });
//         }
//       },
//       error => {
//         console.error('Error checking if user exists:', error);
//         this.errorMessage = 'אירעה שגיאה במהלך בדיקת קיום המשתמש.';
//         Swal.fire('שגיאה', this.errorMessage, 'error');
//       }
//     );
//   }
  
 
// }
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LecturerService } from '../../services/lecturer.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, MatInputModule,
    MatButtonModule,
    MatFormFieldModule,],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userCode: string = ''; // קוד משתמש אוטומטי
  username: string = '';
  password: string = '';
  email: string = '';
  courseName: string = '';
  isLecturerRegistration: boolean = false;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private lecturerService: LecturerService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query params:', params); // הוסף לוגים לבדיקה
      this.username = params['username'] || '';
      this.courseName = params['courseName'] || '';
      this.isLecturerRegistration = params['isLecturer'] === 'true';
      this.generateUserCode(); // יצירת קוד אוטומטי
    });
  }
  
  generateUserCode(): void {
    this.userCode = 'USR-' + Math.floor(Math.random() * 10000).toString();
  }
  register(form: NgForm): void {
   
    if (form.invalid) {
      this.errorMessage = 'נא למלא את כל השדות הדרושים.';
      return;
    }
  
    if (!this.username || !this.password || !this.email || (this.isLecturerRegistration && !this.courseName)) {
      this.errorMessage = 'נא למלא את כל השדות הדרושים.';
      return;
    }
  
    this.userService.getUserByUsername(this.username).subscribe(
      user => {
        if (user) {
          this.errorMessage = 'משתמש קיים כבר!';
          Swal.fire('שגיאה', this.errorMessage, 'error');
        } else {
          const newUser: User = {
            username: this.username,
            password: this.password,
            email: this.email,
            code: this.userCode,
          };
  
          this.userService.addUser(newUser).subscribe(() => {
            console.log('User added successfully');
            
            // אם זה רישום של מרצה, הוסף מרצה
            if (this.isLecturerRegistration) {
              const newLecturer = {
                code: newUser.username,
                name: newUser.username,
                address: '',
                email: newUser.email,
                password: newUser.password,
                courseName: this.courseName
              };
  
              this.lecturerService.addLecturer(newLecturer, this.courseName).subscribe(() => {
                this.performLogin();  // התחברות אוטומטית אחרי רישום
              }, error => {
                console.error('Error adding lecturer:', error);
                this.errorMessage = 'אירעה שגיאה במהלך הוספת המרצה.';
                Swal.fire('שגיאה', this.errorMessage, 'error');
              });
            } else {
              this.performLogin();  // התחברות אוטומטית אחרי רישום
            }
          }, error => {
            console.error('Error adding user:', error);
            this.errorMessage = 'אירעה שגיאה במהלך הוספת המשתמש.';
            Swal.fire('שגיאה', this.errorMessage, 'error');
          });
        }
      },
      error => {
        console.error('Error checking if user exists:', error);
        this.errorMessage = 'אירעה שגיאה במהלך בדיקת קיום המשתמש.';
        Swal.fire('שגיאה', this.errorMessage, 'error');
      }
    );
  }
  

performLogin(): void {
  this.authService.login(this.username, this.password).subscribe(
    () => {
      Swal.fire({
        icon: 'success',
        title: 'Registration was successfully completed!',
        text: 'Welcome!',
        confirmButtonText: 'אוקי'
      }).then((result) => {
        if (result.isConfirmed) {
          this.authService.saveCurrentUser({
            username: this.username,
            password: this.password,
            email: this.email,
            code: this.userCode
          });
          const updatedUser = this.authService.getCurrentUser();

          // הוסף כאן רענון של המידע הנוכחי
          this.authService.refreshCurrentUser();  
          
          // המתן מספר שניות כדי לאפשר למידע להתעדכן לפני המעבר
          setTimeout(() => {
            this.router.navigate(['/all-courses']);  // העבר לקומפוננטת כל הקורסים
          }, 1000);  // המתן שנייה לפני המעבר
        }
      });
    },
    loginError => {
      console.error('Error logging in:', loginError);
      this.errorMessage = 'אירעה שגיאה במהלך ההתחברות.';
      Swal.fire('שגיאה', this.errorMessage, 'error');
    }
  );
}
}