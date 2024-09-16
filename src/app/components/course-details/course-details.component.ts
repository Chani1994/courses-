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
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

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
  course$: Observable<Course[]> | undefined;
  courses: Course[] | undefined;

  isLecturer$: Observable<boolean> = new Observable<boolean>(); // Observable עבור מצב המרצה
  currentUser$: Observable<User | null> = this.userService.getCurrentUser();
  isHighlighted: boolean = false;
  lecturerName: string = ''; 
  lecturer: Lecturer | null = null;
  categoryName:string='';
  category: Category | null=null; // נוסיף משתנה לאחסון הקטגוריה
  @Input() course!: Course;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private courseService: CourseService,
    private lecturerService: LecturerService,  
    private categoryService:CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.course$ = this.courseService.getAllCourses(); // או כל מקור אחר

    if (!this.course$) {
      console.error('Course Observable is not defined.');
      return;
    }

    this.course$.subscribe({
      next: (courses) => {
        console.log('Course from Observable:', courses);
        this.courses = courses;
        this.checkIfHighlighted();
        this.checkIfLecturer();
        this.loadLecturerName();
        this.loadCategory();
      },
      error: (err) => {
        console.error('Error subscribing to course Observable:', err);
      }
    });
  }
  
  
  loadCategory(): void {
    if (!this.course || !this.course.categoryCode) {
      console.error('Category information is missing.');
      return;
    }
  
    console.log('Loading category with code:', this.course.categoryCode);
  
    this.categoryService.getCategoryByCode(this.course.categoryCode).subscribe(
      (category: Category) => {
        console.log('Received category:', category); // להוסיף לוג
        if (!category) {
          console.error('No category returned.');
          return;
        }
        console.log('Category fetched:', category);
        this.category = category;
        this.categoryName = category.name || 'Unnamed Category'; // ניהול ברירת מחדל
        console.log('Category icon path:', this.category?.iconPath);
        console.log('Category name:', this.categoryName);
      },
      (error) => {
        console.error('Error fetching category:', error);
      }
    );
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


  // Method to check if the current user is the lecturer for the course
checkIfLecturer(): void { 
  if (!this.course || !this.course.lecturerCode) {
    console.log('Course or lecturer code is not defined.');
    return;
  }

  // Trim the lecturer code to remove any extra whitespace
  const trimmedLecturerCode = this.course.lecturerCode.trim();

  // Use the current user observable to determine if they are the lecturer
  this.isLecturer$ = this.currentUser$.pipe(
    map((user: User | null) => user ? user.code === trimmedLecturerCode : false)
  );

  // Subscribe to the observable to display the lecturer status
  this.isLecturer$.subscribe(isLecturer => {
    console.log('Is lecturer:', isLecturer);
  });
}

// Method to load the lecturer's name based on the lecturer code
loadLecturerName(): void {
  if (!this.course || !this.course.lecturerCode) return;

  // Trim the lecturer code to ensure there are no extra spaces
  const trimmedLecturerCode = this.course.lecturerCode.trim();

  // Fetch the lecturer's information from the service
  this.lecturerService.getLecturerByCode(trimmedLecturerCode).subscribe(
    (lecturer: Lecturer | undefined) => {
      console.log('Lecturer fetched:', lecturer);
      if (lecturer) {
        this.lecturerName = lecturer.name;
      } else {
        console.log('Lecturer not found.');
      }
    },
    (error) => {
      console.error('Error fetching lecturer:', error);
    }
  );
}

  editCourse(): void {
    this.router.navigate(['/edit-course', this.course.courseCode], {
      state: { course: this.course }
    });
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



