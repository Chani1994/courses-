import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { CategoryService } from '../../services/category.service';
import { LecturerService } from '../../services/lecturer.service';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { Lecturer } from '../../models/lecturer.model';
import { Course, LearningMethod } from '../../models/course.model';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { LearningMethodService } from '../../services/learning-method.service';
import { forkJoin } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule],
})
export class EditCourseComponent implements OnInit {
  course!: Course;
  minDate: string = '';

  courseForm: FormGroup = new FormGroup({});
  categories: Category[] = [];
  lecturerCodes: Lecturer[] = [];
  courseId: string = ''; // השתנה ל-ID של הקורס
  selectedCategory?: Category;
  learningMethods: LearningMethod[] = [];
  selectedLearningMethod?: LearningMethod;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private categoryService: CategoryService,
    private lecturerService: LecturerService,
    private learningMethodService: LearningMethodService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
    this.setMinDate(); // קריאה לפונקציה לקביעת תאריך המינימום

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['id']; 
      if (this.courseId) {
        this.loadInitialData();
      } else {
        console.error('Course ID is missing');
      }
    });
  
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { course: Course };
    if (state && state.course) {
      this.courseForm.patchValue(state.course);
      this.setSyllabus(state.course.syllabus || []);
      this.setLecturerName(state.course.lecturerCode);
    }
  
    if (this.course && this.course.category) {
      this.selectedCategory = this.categories.find(cat => cat.code === this.course.category.code);
      this.courseForm.get('category')?.setValue(this.selectedCategory?.code || '');
    }
  }
  
  onCategoryChange(event: any): void {
    const selectedCategoryCode = event.target.value;
    this.selectedCategory = this.categories.find(cat => cat.code === selectedCategoryCode);
    this.courseForm.get('category')?.setValue(selectedCategoryCode);
  }
 
  loadInitialData(): void {
    forkJoin({
      categories: this.categoryService.getCategories(),
      learningMethods: this.learningMethodService.getAllLearningMethods(),
      course: this.courseService.getCourseById(this.courseId),
      lecturers: this.lecturerService.getAllLecturers() // הוסף את זה כדי לטעון את כל המרצים
    }).subscribe(
      ({ categories, learningMethods, course, lecturers }) => {
        this.categories = categories;
        this.learningMethods = learningMethods;
        this.course = course;
        this.lecturerCodes = lecturers; // שמור את המרצים שנטענו
  
        this.courseForm.patchValue({
          courseCode: course.courseCode,
          name: course.courseName,
          category: course.category ? course.category.code : '', 
          numberOfLessons: course.numberOfLessons,
          startDate: this.formatDate(course.startDate),
          syllabus: course.syllabus,
          learningMethod: course.learningMethod,
          image: course.imagePath,
          lecturerCode: course.lecturerCode // עדכן את השדה של קוד המרצה
        });
  
        this.setSyllabus(course.syllabus || []);
  
        if (course.category) {
          this.selectedCategory = this.categories.find(cat => cat.code === course.category.code) || undefined;
          this.courseForm.get('category')?.setValue(this.selectedCategory ? this.selectedCategory.code : '');
        }
  
        if (course.learningMethod) {
          this.selectedLearningMethod = this.learningMethods.find(method => method === course.learningMethod) || undefined;
          this.courseForm.get('learningMethod')?.setValue(this.selectedLearningMethod ? this.selectedLearningMethod : '');
        }
  
        if (course.lecturerCode) {
          this.setLecturerName(course.lecturerCode); // עדכן את שם המרצה אם יש קוד מרצה
        }
      },
      (error) => {
        console.error('Error loading initial data:', error);
      }
    );
  }
  
  initForm(): void {
    this.courseForm = this.fb.group({
      courseCode: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required], // Ensure this is a form control
      lecturerCode: ['', Validators.required],
      lecturerName: [{ value: '', disabled: true }],
      numberOfLessons: ['', Validators.required],
      startDate: ['', Validators.required],
      syllabus: this.fb.array([]),
      learningMethod: ['', Validators.required], 
      image: ['']
    });
  }

  formatDate(date: any): string {
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];
      } else {
        console.error('Invalid date object:', date);
        return '';
      }
    } else if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    } else {
      console.error('Invalid date object:', date);
      return '';
    }
  }
  setMinDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }
  setSyllabus(syllabus: string[]): void {
    const syllabusFormArray = this.courseForm.get('syllabus') as FormArray;
    syllabusFormArray.clear();
    syllabus.forEach(topic => {
      syllabusFormArray.push(this.fb.control(topic));
    });
  }

  setLecturerName(lecturerCode: string): void {
    const lecturer = this.lecturerCodes.find(l => l.code === lecturerCode);
    if (lecturer) {
      this.courseForm.get('lecturerName')?.setValue(lecturer.name);
    }
  }

  get syllabus(): FormArray {
    return this.courseForm.get('syllabus') as FormArray;
  }

  addSyllabusField(): void {
    this.syllabus.push(this.fb.control(''));
  }

  removeSyllabusField(index: number): void {
    this.syllabus.removeAt(index);
  }

  onLecturerCodeChange(event: any): void {
    const selectedCode = event.target.value;
    this.setLecturerName(selectedCode);
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const syllabus = this.courseForm.get('syllabus')?.value.filter((field: string) => field.trim() !== '');
  
      if (syllabus.length === 0) {
        Swal.fire('Error!', 'The syllabus cannot be empty.', 'error');
        return;
      }
  
      const updatedCourse = {
        ...this.courseForm.value,
        syllabus: syllabus,
        courseCode: this.courseId, // Ensure this is correct
        category: this.selectedCategory ? {
          code: this.selectedCategory.code,
          name: this.selectedCategory.name,
          iconPath: this.selectedCategory.iconPath
        } : null,
      };
  
      console.log('Form value:', this.courseForm.value);
      console.log('Updated Course:', updatedCourse);
  
      this.courseService.updateCourse(updatedCourse).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Course updated successfully!',
            showConfirmButton: true,
          }).then(() => {
            this.router.navigate(['/all-courses']);
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error occurred while updating course:', error); // Add logging
          Swal.fire({
            icon: 'error',
            title: 'Update failed',
            text: `An error occurred while updating the course: ${error.message}`,
            showConfirmButton: true,
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid fields',
        text: 'Please fill out all required fields.',
        showConfirmButton: true,
      });
    }
  }
  
  cancel(): void {
    this.router.navigate(['/all-courses']);
  }
}

