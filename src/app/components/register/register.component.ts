
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
  address:string= '';
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
      this.password = params['password'] || '';

      // this.courseName = params['courseName'] || '';
      this.isLecturerRegistration = params['isLecturer'] === 'true';
      this.generateUserCode(); // יצירת קוד אוטומטי
    });
  }
  
  generateUserCode(): void {
    this.userCode = 'USR-' + Math.floor(Math.random() * 10000).toString();
  }
  register(form: NgForm): void {
   
    if (form.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
  
    if (!this.username || !this.password || !this.email ||!this.address|| (this.isLecturerRegistration && !this.courseName)) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
  
    this.userService.getUserByUsername(this.username).subscribe(
      user => {
        if (user) {
          this.errorMessage = 'User already exists!';
          Swal.fire('Error', this.errorMessage, 'error');
        } else {
          const newUser: User = {
            username: this.username,
            password: this.password,
            address:this.address,
            email: this.email,
            code: this.userCode,
          };
  
          this.userService.addUser(newUser).subscribe(() => {
            console.log('User added successfully');
            
            // אם זה רישום של מרצה, הוסף מרצה
            if (this.isLecturerRegistration) {
              const newLecturer = {
                code: newUser.code,
                name: newUser.username,
                address: newUser.address,
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
            Swal.fire('Error', this.errorMessage, 'error');
          });
        }
      },
      error => {
        console.error('Error checking if user exists:', error);
        this.errorMessage = 'אירעה שגיאה במהלך בדיקת קיום המשתמש.';
        Swal.fire('Error', this.errorMessage, 'error');
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
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          this.authService.saveCurrentUser({
            username: this.username,
            password: this.password,
            address:this.address,
            email: this.email,
            code: this.userCode,
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
      Swal.fire('Error', this.errorMessage, 'error');
    }
  );
}
}