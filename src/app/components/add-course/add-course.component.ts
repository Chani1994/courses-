// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Category } from '../../models/category.model';
// import { Router } from '@angular/router';
// import { CourseService } from '../../services/course.service';
// import { CategoryService } from '../../services/category.service';
// import { CommonModule } from '@angular/common';
// import Swal from 'sweetalert2';
// import { HttpErrorResponse } from '@angular/common/http';
// import { LecturerService } from '../../services/lecturer.service';
// import { Lecturer } from '../../models/lecturer.model';

// @Component({
//   selector: 'app-add-course',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './add-course.component.html',
//   styleUrls: ['./add-course.component.scss']
// })
// export class AddCourseComponent implements OnInit {
//   courseForm: FormGroup;
//   categories: Category[] = [];  // Categories data
//   lecturers: Lecturer[] = [];  // List of lecturers
//   lecturerCodes: string[] = []; // Lecturer codes

//   constructor(
//     private fb: FormBuilder,
//     private lecturerService: LecturerService,
//     private categoryService: CategoryService,
//     private courseService: CourseService,
//     private router: Router
//   ) {
//     this.courseForm = this.fb.group({
//       code: ['', Validators.required],
//       name: ['', Validators.required],
//       category: ['', Validators.required],
//       numberOfLessons: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
//       startDate: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
//       syllabus: this.fb.array([]),
//       learningMode: ['', Validators.required],
//       image: [''],
//       lecturerCode: ['', Validators.required],
//       lecturerName: [{ value: '', disabled: true }] // Disabled input for lecturer name
//     });
//   }

//   ngOnInit(): void {
//     this.loadLecturerCodes();
//     this.categoryService.getCategories().subscribe(
//       (data: Category[]) => {
//         this.categories = data;
//       },
//       (error: HttpErrorResponse) => {
//         console.error('Error fetching categories', error);
//       }
//     );
//     this.addSyllabusField(); // Add a default syllabus field
//   }

//   // Access FormArray for syllabus
//   get syllabus() {
//     return this.courseForm.get('syllabus') as FormArray;
//   }

//   addSyllabusField() {
//     this.syllabus.push(this.fb.control(''));
//   }

//   removeSyllabusField(index: number) {
//     if (this.syllabus.length > 1) {
//       this.syllabus.removeAt(index);
//     }
//   }

//   onSubmit(): void {
//     if (this.courseForm.valid) {
//       // סינון שדות ריקים מתוך הסיליבוס
//       const syllabus = this.courseForm.get('syllabus')?.value.filter((field: string) => field.trim() !== '');
  
//       if (syllabus.length === 0) {
//         Swal.fire('Error!', 'The syllabus cannot be empty.', 'error');
//         return;
//       }
  
//       const selectedCategoryCode = this.courseForm.get('category')?.value;
//       const selectedCategory = this.categories.find(cat => cat.code === selectedCategoryCode);
  
//       if (!selectedCategory) {
//         Swal.fire('Error!', 'The selected category is invalid.', 'error');
//         return;
//       }
  
//       const newCourse = {
//         courseCode: this.courseForm.get('code')?.value,
//         courseName: this.courseForm.get('name')?.value,
//         category: {
//           code: selectedCategory.code,
//           name: selectedCategory.name,
//           iconPath: selectedCategory.iconPath,
//         },
//         numberOfLessons: +this.courseForm.get('numberOfLessons')?.value, // Ensure it's a number
//         startDate: this.courseForm.get('startDate')?.value,
//         syllabus: syllabus, // Use the filtered syllabus
//         learningMethod: this.courseForm.get('learningMode')?.value,
//         imagePath: this.courseForm.get('image')?.value,
//         lecturerCode: this.courseForm.get('lecturerCode')?.value // Use the actual lecturer code
//       };
  
//       this.courseService.addCourse(newCourse).subscribe(
//         (response: any) => {
//           console.log('Course added successfully', response);
//           Swal.fire('Success!', 'Course added successfully.', 'success').then(() => {
//             this.router.navigate(['/all-courses']);
//           });
//         },
//         (error: HttpErrorResponse) => {
//           console.error('Error adding course', error);
//           console.error('Error response body:', error.error); // להוסיף כאן כדי לראות פרטים נוספים

//           Swal.fire('Error!', 'Failed to add the course.', 'error');
//         }
//       );
//     } else {
//       console.error('The form is not valid');
//       Swal.fire('Error!', 'Please fill out all required fields.', 'error');
//     }
//   }
//   loadLecturerCodes(): void {
//     this.lecturerService.getAllLecturers().subscribe(
//       (lecturers: Lecturer[]) => {
//         this.lecturers = lecturers;
//         this.lecturerCodes = lecturers.map(lecturer => lecturer.code);
//       },
//       (error: HttpErrorResponse) => {
//         console.error('Error fetching lecturer codes', error);
//       }
//     );
//   }

//   onLecturerCodeChange(event: Event) {
//     const selectedCode = (event.target as HTMLSelectElement).value;
//     const selectedLecturer = this.lecturers.find(lecturer => lecturer.code === selectedCode);
  
//     if (selectedLecturer) {
//       this.courseForm.get('lecturerName')?.setValue(selectedLecturer.name);
//     } else {
//       // Clear the lecturer name if no lecturer is found
//       this.courseForm.get('lecturerName')?.setValue('');
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { LecturerService } from '../../services/lecturer.service';
import { Lecturer } from '../../models/lecturer.model';
import { LearningMethodService } from '../../services/learning-method.service';
import { LearningMethod } from '../../models/course.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  courseForm: FormGroup;
  categories: Category[] = [];  // Categories data
  lecturers: Lecturer[] = [];  // List of lecturers
  lecturerCodes: string[] = []; // Lecturer codes
  learningMethods: LearningMethod[] = []; // Learning methods data
  minDate: string = '';

  constructor(
    private fb: FormBuilder,
    private lecturerService: LecturerService,
    private categoryService: CategoryService,
    private courseService: CourseService,
    private router: Router,
    private learningMethodService: LearningMethodService // Add service for learning methods
  ) {
    this.courseForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      numberOfLessons: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      startDate: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
      syllabus: this.fb.array([]),
      learningMode: ['', Validators.required],
      image: [''],
      lecturerCode: ['', Validators.required],
      lecturerName: [{ value: '', disabled: true }] // Disabled input for lecturer name
    });
    this.setMinDate(); // קריאה לפונקציה לקביעת תאריך המינימום

  }

  ngOnInit(): void {
    this.loadLecturerCodes();
    this.loadCategories();
    this.loadLearningMethods(); // Load learning methods
    this.addSyllabusField(); // Add a default syllabus field
  }

  // Access FormArray for syllabus
  get syllabus() {
    return this.courseForm.get('syllabus') as FormArray;
  }

  addSyllabusField() {
    this.syllabus.push(this.fb.control(''));
  }

  removeSyllabusField(index: number) {
    if (this.syllabus.length > 1) {
      this.syllabus.removeAt(index);
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching categories', error);
      }
    );
  }

  
  loadLearningMethods(): void {
    this.learningMethodService.getAllLearningMethods().subscribe(
      (methods: LearningMethod[]) => { // Ensure methods parameter is typed
        this.learningMethods = methods;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching learning methods:', error);
      }
    );
  }

  loadLecturerCodes(): void {
    this.lecturerService.getAllLecturers().subscribe(
      (lecturers: Lecturer[]) => {
        this.lecturers = lecturers;
        this.lecturerCodes = lecturers.map(lecturer => lecturer.code);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching lecturer codes', error);
      }
    );
  }

  onLecturerCodeChange(event: MatSelectChange) {
    const selectedCode = event.value;

    // const selectedCode = (event.target as HTMLSelectElement).value;
    const selectedLecturer = this.lecturers.find(lecturer => lecturer.code === selectedCode);
  
    if (selectedLecturer) {
      this.courseForm.get('lecturerName')?.setValue(selectedLecturer.name);
    } else {
      // Clear the lecturer name if no lecturer is found
      this.courseForm.get('lecturerName')?.setValue('');
    }
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      // Filter out empty syllabus fields
      const syllabus = this.courseForm.get('syllabus')?.value.filter((field: string) => field.trim() !== '');

      if (syllabus.length === 0) {
        Swal.fire('Error!', 'The syllabus cannot be empty.', 'error');
        return;
      }

      const selectedCategoryCode = this.courseForm.get('category')?.value;
      const selectedCategory = this.categories.find(cat => cat.code === selectedCategoryCode);

      if (!selectedCategory) {
        Swal.fire('Error!', 'The selected category is invalid.', 'error');
        return;
      }

      const newCourse = {
        courseCode: this.courseForm.get('code')?.value,
        courseName: this.courseForm.get('name')?.value,
        category: {
          code: selectedCategory.code,
          name: selectedCategory.name,
          iconPath: selectedCategory.iconPath,
        },
        numberOfLessons: +this.courseForm.get('numberOfLessons')?.value, // Ensure it's a number
        startDate: this.courseForm.get('startDate')?.value,
        syllabus: syllabus, // Use the filtered syllabus
        learningMethod: this.courseForm.get('learningMode')?.value,
        imagePath: this.courseForm.get('image')?.value,
        lecturerCode: this.courseForm.get('lecturerCode')?.value // Use the actual lecturer code
      };

      this.courseService.addCourse(newCourse).subscribe(
        (response: any) => {
          console.log('Course added successfully', response);
          Swal.fire('Success!', 'Course added successfully.', 'success').then(() => {
            this.router.navigate(['/all-courses']);
          });
        },
        (error: HttpErrorResponse) => {
          console.error('Error adding course', error);
          console.error('Error response body:', error.error); // Additional details

          Swal.fire('Error!', 'Failed to add the course.', 'error');
        }
      );
    } else {
      console.error('The form is not valid');
      Swal.fire('Error!', 'Please fill out all required fields.', 'error');
    }
  }
  setMinDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }
}
