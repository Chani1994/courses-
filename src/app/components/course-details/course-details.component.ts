import { Component, Input, OnInit } from '@angular/core';
import { Course, LearningMethod } from '../../models/course.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { CourseService } from '../../services/course.service';
import { User } from '../../models/user.model'; // ודא שיש לך מודל User
// import { HttpErrorResponse } from '@angular/common/http';
import { LecturerService } from '../../services/lecturer.service';
import { Lecturer } from '../../models/lecturer.model';
import { Router } from '@angular/router';
import { LearningModeIconPipe } from '../../pipes/learning-mode-icon.pipe';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule,LearningModeIconPipe],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  @Input() course!: Course;
  isLecturer: boolean = false;
  isHighlighted: boolean = false;
  lecturerName: string = ''; // הוספת משתנה לשם המרצה
  lecturerId: string='';
  lecturer: any; // שים לב לשנות זאת לסוג המתאים
  constructor(
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
  
    console.log('Course data:', this.course); // בדוק מה המידע שמתקבל בקורס
    
    if (!this.course.category) {
      console.error('Category is not defined for this course:', this.course);
    } else {
      console.log('Category for this course:', this.course.category);
    }
  
    this.checkIfHighlighted();
    this.checkIfLecturer();
    this.loadLecturerName();
  }
  
  checkIfHighlighted(): void {
    if (!this.course || !this.course.startDate) return;

    const courseStartDate = new Date(this.course.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // איפוס שעות, דקות, שניות ומילישניות של היום הנוכחי
    const oneWeekLater = new Date();
    oneWeekLater.setHours(0, 0, 0, 0); // איפוס שעות, דקות, שניות ומילישניות של השבוע הבא
    oneWeekLater.setDate(today.getDate() + 7);

    // וידוא אם תאריך התחלת הקורס נמצא בין היום לשבוע הקרוב (כולל היום)
    this.isHighlighted = courseStartDate >= today && courseStartDate <= oneWeekLater;
}

checkIfLecturer(): void {
  if (!this.course || !this.course.lecturerCode) {
    console.log('Course or lecturer code is not defined.');
    return;
  }

  const currentUser = this.userService.getCurrentUser();
  console.log('Current user from getCurrentUser:', currentUser);

  if (!currentUser) {
    console.log('No user token found in sessionStorage. Redirecting to login.');
    // אפשר להוסיף טיפול במצבים כאלה, לדוגמה להפנות את המשתמש למסך התחברות או להציג הודעה מתאימה
    // לדוגמה:
    // this.router.navigate(['/login']);
    return;
  }

  this.userService.getUserByUsername(currentUser.username).subscribe(
    (user: User | null) => {
      if (user) {
        console.log('Current user:', user);
        this.isLecturer = user.username === this.course.lecturerCode;
        console.log('Is lecturer:', this.isLecturer);
      } else {
        console.log('User not found.');
      }
    },
    (error) => {
      console.error('Error fetching user:', error);
    }
  );
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
  fetchLecturer(): void {
    this.lecturerService.getLecturerById(this.lecturerId).subscribe(
      (data) => {
        this.lecturer = data;
      },
      (error) => {
        console.error('Error fetching lecturer:', error);
      }
    );
  }
  
  getLearningMethodEnum(value: string): LearningMethod {
    if (Object.values(LearningMethod).includes(value as LearningMethod)) {
      return value as LearningMethod;
    }
    return LearningMethod['In-Person']; // ערך ברירת מחדל במידה ואין התאמה
  }

}
