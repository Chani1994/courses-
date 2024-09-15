
  
  import { Component, OnInit, OnDestroy } from '@angular/core';
  import { Course, LearningMethod } from '../../models/course.model';
  import { CourseService } from '../../services/course.service';
  import { CourseDetailsComponent } from '../course-details/course-details.component';
  import { CommonModule } from '@angular/common';
  import { Category } from '../../models/category.model';
  import { CategoryService } from '../../services/category.service';
  import { AuthService } from '../../services/auth.service';
  import { Router } from '@angular/router';
  import { HttpClientModule } from '@angular/common/http';
  import { Subscription } from 'rxjs';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatSelectChange, MatSelectModule } from '@angular/material/select';
  import { MatGridListModule } from '@angular/material/grid-list';
  import { MatButtonModule } from '@angular/material/button';
  
  @Component({
    selector: 'app-all-courses',
    standalone: true,
    imports: [CourseDetailsComponent, CommonModule, HttpClientModule, MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatGridListModule,
      MatButtonModule],
    templateUrl: './all-courses.component.html',
    styleUrls: ['./all-courses.component.scss']
  })
  export class AllCoursesComponent implements OnInit, OnDestroy {
    isAuthenticated: boolean = false;
    private authSubscription!: Subscription;
    courses: Course[] = [];
    filteredCourses: Course[] = [];
    categories: Category[] = [];
    learningModes: LearningMethod[] = [LearningMethod['In-Person'], LearningMethod.Zoom];
    filters: { courseName: string; category: string; learningMode: LearningMethod | '' } = {
      courseName: '',
      category: '',
      learningMode: ''
    };
    selectedCategoryCode: string = '';
  
    constructor(
      public authService: AuthService,
      private courseService: CourseService,
      private categoryService: CategoryService,
      private router: Router
    ) {}
  
    ngOnInit(): void {
      this.isAuthenticated = this.authService.isAuthenticated();
      this.loadCourses();
      this.loadCategories();
    }
  
    ngOnDestroy(): void {
      if (this.authSubscription) {
        this.authSubscription.unsubscribe();
      }
    }
  
    loadCourses() {
      this.courseService.getAllCourses().subscribe((data: Course[]) => {
        this.courses = data;
        this.filteredCourses = data;
      }, error => {
        console.error('There was an error!', error);
      });
    }
  
    loadCategories() {
      this.categoryService.getCategories().subscribe(
        (data: Category[]) => {
          this.categories = data;
        },
        (error) => {
          console.error('There was an error!', error);
        }
      );
    }
  
    onFilterChange(type: string, event: MatSelectChange | any): void {
      let value: any;
    
      if (event instanceof MatSelectChange) {
        value = event.value;
      } else {
        value = event.target ? event.target.value : '';
      }
      
      if (type === 'category') {
        this.selectedCategoryCode = value;
      } else if (type === 'courseName') {
        this.filters.courseName = value;
      } else if (type === 'learningMode') {
        this.filters.learningMode = value;
      }
    
      console.log('Updated filters:', this.filters);  // Check if all filters are updated
      this.applyFilters();  // Apply the filters
    }
  
    applyFilters() {
      if (!this.courses) return;
    
      this.filteredCourses = this.courses.filter(course => {
        const passesNameFilter = !this.filters.courseName || course.courseName.toLowerCase().includes(this.filters.courseName.toLowerCase());
        const passesCategoryFilter = !this.selectedCategoryCode || course.categoryCode === this.selectedCategoryCode;
        const passesLearningModeFilter = !this.filters.learningMode || course.learningMethod === this.filters.learningMode;
    
        return passesNameFilter && passesCategoryFilter && passesLearningModeFilter;
      });
    
      console.log('Filtered courses:', this.filteredCourses);
    }
  
    goToLogin() {
      this.router.navigate(['/login']);
    }
  }
  



