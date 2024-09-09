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



