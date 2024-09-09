import { Component, Input, OnInit } from '@angular/core';
import { Course, LearningMethod } from '../../models/course.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { User } from '../../models/user.model'; 
import { LecturerService } from '../../services/lecturer.service';
import { Lecturer } from '../../models/lecturer.model';
import { Router } from '@angular/router';
import { LearningModeIconPipe } from '../../pipes/learning-mode-icon.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [ CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    LearningModeIconPipe ],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  @Input() course$!: Observable<Course>; // התייחסות ל-Observable של קורס
  isLecturer$: Observable<boolean> = new Observable<boolean>(); // Observable עבור מצב המרצה
  currentUser$: Observable<User | null> = this.userService.getCurrentUser();
  isHighlighted: boolean = false;
  lecturerName: string = ''; 
  lecturer: Lecturer | null = null;
  @Input() course!: Course;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private courseService: CourseService,
    private lecturerService: LecturerService,  
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.course) {
      console.error('Course is not defined');
      return;
    }

    this.checkIfHighlighted();
    this.checkIfLecturer();
    this.loadLecturerName();
  }

  checkIfHighlighted(): void {
    if (!this.course || !this.course.startDate) return;

    const courseStartDate = new Date(this.course.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeekLater = new Date();
    oneWeekLater.setHours(0, 0, 0, 0);
    oneWeekLater.setDate(today.getDate() + 7);

    this.isHighlighted = courseStartDate >= today && courseStartDate <= oneWeekLater;
  }

  checkIfLecturer(): void {
    if (!this.course || !this.course.lecturerCode) {
      console.log('Course or lecturer code is not defined.');
      return;
    }

    this.isLecturer$ = this.currentUser$.pipe(
      map((user: User | null) => user ? user.username === this.course.lecturerCode.trim() : false)
    );

    // להירשם ל-Observable כדי להציג את הסטטוס של המרצה
    this.isLecturer$.subscribe(isLecturer => {
      console.log('Is lecturer:', isLecturer);
    });
  }

  editCourse(): void {
    this.router.navigate(['/edit-course', this.course.courseCode], {
      state: { course: this.course }
    });
  }

  loadLecturerName(): void {
    if (!this.course || !this.course.lecturerCode) return;
  
    this.lecturerService.getLecturerByCode(this.course.lecturerCode.trim()).subscribe(
      (lecturer: Lecturer | undefined) => {
        console.log('Lecturer fetched:', lecturer);
        if (lecturer) {
          this.lecturerName = lecturer.name;
        }
      },
      (error) => {
        console.error('Error fetching lecturer:', error);
      }
    );
  }

  get learningModeAsString(): string {
    return this.course.learningMethod as unknown as string;
  }


    getLearningMethodEnum(value: string): LearningMethod {
    if (Object.values(LearningMethod).includes(value as LearningMethod)) {
      return value as LearningMethod;
    }
    return LearningMethod['In-Person']; // ערך ברירת מחדל במידה ואין התאמה
  }

}

// // course-details.component.ts

// import { Component, Input, OnInit } from '@angular/core';
// import { Course } from '../../models/course.model';
// import { Observable } from 'rxjs';
// import { User } from '../../models/user.model';
// import { AuthService } from '../../services/auth.service';
// import { LecturerService } from '../../services/lecturer.service';
// import { Lecturer } from '../../models/lecturer.model';
// import { Router } from '@angular/router';
// import { UserService } from '../../services/user.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-course-details',
//   standalone: true,
//   imports: [ CommonModule,],
//   templateUrl: './course-details.component.html',
//   styleUrls: ['./course-details.component.scss']
// })
// export class CourseDetailsComponent implements OnInit {
//   @Input() course!: Course; // הקלט של הקורס
//   isLecturer: boolean = false;
//   isHighlighted: boolean = false;
//   lecturerName: string = '';
//   lecturer: Lecturer | null = null;

//   constructor(
//     private userService:UserService,
//     authService: AuthService,
//     private lecturerService: LecturerService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     if (!this.course) {
//       console.error('Course is not defined');
//       return;
//     }

//     this.checkIfHighlighted();
//     this.checkIfLecturer();
//     this.loadLecturerName();
//   }

//   checkIfHighlighted(): void {
//     if (!this.course || !this.course.startDate) return;

//     const courseStartDate = new Date(this.course.startDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const oneWeekLater = new Date();
//     oneWeekLater.setHours(0, 0, 0, 0);
//     oneWeekLater.setDate(today.getDate() + 7);

//     this.isHighlighted = courseStartDate >= today && courseStartDate <= oneWeekLater;
//   }

//   checkIfLecturer(): void {
//     this.userService.getCurrentUser().subscribe(user => {
//       if (user) {
//         this.isLecturer = user.username === this.course.lecturerCode.trim();
//         console.log('Is lecturer:', this.isLecturer);
//       }
//     });
//   }

//   editCourse(): void {
//     this.router.navigate(['/edit-course', this.course.courseCode], {
//       state: { course: this.course }
//     });
//   }

//   loadLecturerName(): void {
//     if (!this.course || !this.course.lecturerCode) return;

//     this.lecturerService.getLecturerByCode(this.course.lecturerCode.trim()).subscribe(
//       (lecturer: Lecturer | undefined) => {
//         if (lecturer) {
//           this.lecturerName = lecturer.name;
//         }
//       },
//       (error) => {
//         console.error('Error fetching lecturer:', error);
//       }
//     );
//   }
// }


// import { Component, Input, OnInit } from '@angular/core';
// import { Course, LearningMethod } from '../../models/course.model';
// import { UserService } from '../../services/user.service';
// import { CommonModule } from '@angular/common';
// import { CourseService } from '../../services/course.service';
// import { User } from '../../models/user.model'; 
// import { LecturerService } from '../../services/lecturer.service';
// import { Lecturer } from '../../models/lecturer.model';
// import { Router } from '@angular/router';
// import { LearningModeIconPipe } from '../../pipes/learning-mode-icon.pipe';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSelectModule } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';
// import { AuthService } from '../../services/auth.service';
// import { Observable, of } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Component({
//   selector: 'app-course-details',
//   standalone: true,
//   imports: [ CommonModule,
//     MatCardModule,
//     MatButtonModule,
//     MatSelectModule,
//     MatInputModule,
//     LearningModeIconPipe ],
//   templateUrl: './course-details.component.html',
//   styleUrls: ['./course-details.component.scss']
// })
// export class CourseDetailsComponent implements OnInit {
//   currentUser$: Observable<User | null>;
//   isLecturer$: Observable<boolean>;
//   isHighlighted: boolean = false;
//   lecturerName: string = ''; 
//   course$: Observable<Course | null>;

//   @Input() course!: Course;

//   constructor(
//     public authService: AuthService,
//     private userService: UserService,
//     private courseService: CourseService,
//     private lecturerService: LecturerService,  
//     private router: Router
//   ) { 
//     this.currentUser$ = this.userService.getCurrentUser();
//     this.isLecturer$ = this.currentUser$.pipe(
//       map(user => {
//         if (user && this.course) {
//           return user.username === this.course.lecturerCode.trim();
//         }
//         return false;
//       })
//     );
//     this.course$ = of(this.course); // הנחה שהקורס כבר נמצא כאן
//   }

//   ngOnInit(): void {
//     if (!this.course) {
//       console.error('Course is not defined');
//       return;
//     }

//     this.checkIfHighlighted();
//     this.loadLecturerName();
//   }

//   checkIfHighlighted(): void {
//     if (!this.course || !this.course.startDate) return;

//     const courseStartDate = new Date(this.course.startDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const oneWeekLater = new Date();
//     oneWeekLater.setHours(0, 0, 0, 0);
//     oneWeekLater.setDate(today.getDate() + 7);

//     this.isHighlighted = courseStartDate >= today && courseStartDate <= oneWeekLater;
//   }

//   loadLecturerName(): void {
//     if (!this.course || !this.course.lecturerCode) return;

//     this.lecturerService.getLecturerByCode(this.course.lecturerCode.trim()).subscribe(
//       (lecturer: Lecturer | undefined) => {
//         if (lecturer) {
//           this.lecturerName = lecturer.name;
//         }
//       },
//       (error) => {
//         console.error('Error fetching lecturer:', error);
//       }
//     );
//   }

//   editCourse(): void {
//     this.router.navigate(['/edit-course', this.course.courseCode], {
//       state: { course: this.course }
//     });
//   }

//   get learningModeAsString(): string {
//     return this.course.learningMethod as unknown as string;
//   }

//   getLearningMethodEnum(value: string): LearningMethod {
//     if (Object.values(LearningMethod).includes(value as LearningMethod)) {
//       return value as LearningMethod;
//     }
//     return LearningMethod['In-Person'];
//   }
// }

// import { Component, Input, OnInit } from '@angular/core';
// import { Course, LearningMethod } from '../../models/course.model';
// import { UserService } from '../../services/user.service';
// import { CommonModule } from '@angular/common';
// import { CourseService } from '../../services/course.service';
// import { User } from '../../models/user.model'; 
// import { LecturerService } from '../../services/lecturer.service';
// import { Lecturer } from '../../models/lecturer.model';
// import { Router } from '@angular/router';
// import { LearningModeIconPipe } from '../../pipes/learning-mode-icon.pipe';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSelectModule } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';
// import { AuthService } from '../../services/auth.service';
// import { Observable } from 'rxjs';
// @Component({
//   selector: 'app-course-details',
//   standalone: true,
//   imports: [ CommonModule,
//     MatCardModule,
//     MatButtonModule,
//     MatSelectModule,
//     MatInputModule,
//     LearningModeIconPipe ],// ייבוא הפייפ המותאם אישית לשימוש בקומפוננטה],
//   templateUrl: './course-details.component.html',
//   styleUrls: ['./course-details.component.scss']
// })
// export class CourseDetailsComponent implements OnInit {
//   currentUser$: Observable<User | null>;

//   @Input() course!: Course;
//   isLecturer: boolean = false;
//   isHighlighted: boolean = false;
//   lecturerName: string = ''; // הוספת משתנה לשם המרצה
//   lecturerId: string='';
//   lecturer: Lecturer | null = null;
//   constructor(
//     public authService: AuthService,
//     private userService: UserService,
//     private courseService: CourseService,
//     private lecturerService: LecturerService,  
//     private router: Router

//   ) {    this.currentUser$ = this.authService.getCurrentUser(); // הנחה שהשירות מחזיר Observable
// }

//   ngOnInit(): void {
//     if (!this.course) {
//       console.error('Course is not defined');
//       return;
//     }
  
//     console.log('Course data:', this.course); // בדוק מה המידע שמתקבל בקורס
  
//     if (!this.course.category) {
//       console.error('Category is not defined for this course:', this.course);
//     } else {
//       console.log('Category for this course:', this.course.category);
//     }
//       this.currentUser$.subscribe(user => {
//         if (user) {
//           this.userService.getUserByUsername(user.username).subscribe(lecturer => {
//             // טיפול בפרטי המרצה
//           });
//         }
//       });
    
  
//     this.checkIfHighlighted();
//     this.checkIfLecturer();
//     this.loadLecturerName();
//   }
  
//   checkIfHighlighted(): void {
//     if (!this.course || !this.course.startDate) return;

//     const courseStartDate = new Date(this.course.startDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // איפוס שעות, דקות, שניות ומילישניות של היום הנוכחי
//     const oneWeekLater = new Date();
//     oneWeekLater.setHours(0, 0, 0, 0); // איפוס שעות, דקות, שניות ומילישניות של השבוע הבא
//     oneWeekLater.setDate(today.getDate() + 7);

//     // וידוא אם תאריך התחלת הקורס נמצא בין היום לשבוע הקרוב (כולל היום)
//     this.isHighlighted = courseStartDate >= today && courseStartDate <= oneWeekLater;
// }

// checkIfLecturer(): void {
//   if (!this.course || !this.course.lecturerCode) {
//     console.log('Course or lecturer code is not defined.');
//     return;
//   }

//   const currentUser = this.userService.getCurrentUser();
//   console.log('Current user from getCurrentUser:', currentUser);

//   if (!currentUser) {
//     console.log('No user token found in sessionStorage. Redirecting to login.');
//     return;
//   }

//   this.userService.getUserByUsername(currentUser.username).subscribe(
//     (user: User | null) => {
//       if (user) {
//         console.log('Current user:', user);
//         this.isLecturer = user.username === this.course.lecturerCode.trim();
//         console.log('Is lecturer:', this.isLecturer);
//       } else {
//         console.log('User not found.');
//       }
//     },
//     (error) => {
//       console.error('Error fetching user:', error);
//     }
//   );
// }

  
//   editCourse(): void {
//     this.router.navigate(['/edit-course', this.course.courseCode], {
//       state: { course: this.course }
//     });
//   }
//   loadLecturerName(): void {
//     if (!this.course || !this.course.lecturerCode) return;
  
//     this.lecturerService.getLecturerByCode(this.course.lecturerCode.trim()).subscribe(
//       (lecturer: Lecturer | undefined) => {
//         console.log('Lecturer fetched:', lecturer);
//         if (lecturer) {
//           this.lecturerName = lecturer.name;
//         }
//       },
//       (error) => {
//         console.error('Error fetching lecturer:', error);
//       }
//     );
//   }
  
//   get learningModeAsString(): string {
//     return this.course.learningMethod as unknown as string;
//   }
//   fetchLecturer(): void {
//     this.lecturerService.getLecturerById(this.lecturerId).subscribe(
//       (lecturer: Lecturer | null) => {
//         if (lecturer) {
//           this.lecturer = lecturer;
//         } else {
//           console.log('Lecturer not found.');
//         }
//       },
//       (error) => {
//         console.error('Error fetching lecturer:', error);
//       }
//     );
//   }
  
//   getLearningMethodEnum(value: string): LearningMethod {
//     if (Object.values(LearningMethod).includes(value as LearningMethod)) {
//       return value as LearningMethod;
//     }
//     return LearningMethod['In-Person']; // ערך ברירת מחדל במידה ואין התאמה
//   }

// }
