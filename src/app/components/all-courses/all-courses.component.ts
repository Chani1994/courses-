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
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectChange } from '@angular/material/select'; // Import if available

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
  filters: { name: string; category: string; learningMode: LearningMethod | '' } = {
    name: '',
    category: '',
    learningMode: ''
  };

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (this.isAuthenticated) {
        this.loadCourses();
        this.loadCategories();
      }
    });

    if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
      this.loadCourses();
      this.loadCategories();
    }
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
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

  onFilterChange(filterName: keyof typeof this.filters, event: Event | MatSelectChange) {
    if (filterName === 'learningMode' || filterName === 'category') {
      const selectEvent = event as MatSelectChange;
      this.filters[filterName] = selectEvent.value;
    } else {
      const inputEvent = event as InputEvent;
      const target = inputEvent.target as HTMLInputElement;
      this.filters[filterName] = target.value;
    }
    
    this.applyFilters();
  }
  applyFilters() {
    this.filteredCourses = this.courses.filter((course) => {
      return (
        (!this.filters.name || course.courseName.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.category || course.category.code === this.filters.category) &&
        (!this.filters.learningMode || course.learningMethod === this.filters.learningMode)
      );
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}


