import { Observable, catchError, forkJoin, map, mergeMap, of, tap, throwError } from "rxjs";
import { Course, LearningMethod } from "../models/course.model";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Category } from "../models/category.model";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/courses'; // API URL for courses
  private categoriesUrl = 'http://localhost:3000/categories'; // API URL for categories

  // קורסי ברירת מחדל לפי קטגוריות
//   private defaultCourses: Course[] = [
//     { 
//         category: { code: '001', name: 'Teaching', iconPath: 'assets/images/teach-1968076_1280.jpg' }, 
//         courseCode: 'DEF001', 
//         courseName: 'English Course', 
//         numberOfLessons: 10, 
//         startDate: new Date('2024-09-25'), 
//         syllabus: ['Introduction to Teaching'], 
//         learningMethod: LearningMethod.Zoom,
//         lecturerCode: 'USR-4662', 
//         imagePath: 'assets/images/english-british-england-language-education-concept.jpg' 
//     },
//     { 
//         category: { code: '002', name: 'Creation and Art', iconPath: 'assets/images/hand-4752642_1280.jpg' }, 
//         courseCode: 'DEF002', 
//         courseName: 'Sewing for Beginners', 
//         numberOfLessons: 5, 
//         startDate: new Date('2024-09-15'), 
//         syllabus: ['Sewing Basics'], 
//         learningMethod: LearningMethod["In-Person"], 
//         lecturerCode: 'USR-8948', 
//         imagePath: 'assets/images/top-view-variety-fabrics-with-thread-scissors.jpg' 
//     },
//     { 
//         category: { code: '003', name: 'Computers', iconPath: 'assets/images/pexels-pixabay-38568.jpg' }, 
//         courseCode: 'DEF003', 
//         courseName: 'Architecture Course', 
//         numberOfLessons: 12, 
//         startDate: new Date('2024-10-30'), 
//         syllabus: ['Introduction to Architecture'], 
//         learningMethod: LearningMethod.Zoom, 
//         lecturerCode: 'USR-7609', 
//         imagePath: 'assets/images/high-angle-architectural-objects-desk.jpg' 
//     },
//     { 
//         category: { code: '004', name: 'Medicine', iconPath: 'assets/images/syringes-3539565_1280.jpg' }, 
//         courseCode: 'DEF004', 
//         courseName: 'Medical Secretarial Studies', 
//         numberOfLessons: 8, 
//         startDate: new Date('2024-09-30'), 
//         syllabus: ['Basics of Medicine'], 
//         learningMethod: LearningMethod["In-Person"], 
//         lecturerCode: 'USR-445', 
//         imagePath: 'assets/images/cold-1972619_1280.jpg' 
//     },
// ];


  constructor(private http: HttpClient) {}


  // קבלת כל הקורסים
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
    
  }
  // Method to add a new course
  addCourse(courseData: Course): Observable<any> {
    return this.http.post<any>(this.apiUrl, courseData).pipe(
      catchError(this.handleError<any>('addCourse'))
    );
  }

  // עדכון קורס
  updateCourse(course: Course): Observable<any> {
    if (!course.courseCode) {
      return throwError('Course ID is required for update');
    }

    return this.http.put(`${this.apiUrl}/${course.courseCode}`, course).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = `Update failed: ${error.status} - ${error.message}`;
        return throwError(errorMsg); // זרוק שגיאה מפורטת
      })
    );
  }

  // Method to delete a course
  deleteCourse(courseCode: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseCode}`).pipe(
      catchError(this.handleError<void>('deleteCourse'))
    );
  }

  // Method to get a course by its code
  getCourseById(courseCode: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${courseCode}`).pipe(
      catchError(this.handleError<Course>('getCourseById'))
    );
  }

  // Method to fetch all categories from the server
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl).pipe(
      catchError(this.handleError<Category[]>('getCategories', []))
    );
  }

  
  // Method to initialize courses by posting them to the server
  initializeCourses(courses: Course[]): Observable<void[]> {
    // Validate all course fields before sending them
    const validCourses = courses.filter(course =>
      course.courseCode && course.courseName && course.numberOfLessons && course.learningMethod && course.lecturerCode
    );

    if (validCourses.length !== courses.length) {
      const invalidCourses = courses.filter(course =>
        !course.courseCode || !course.courseName || !course.numberOfLessons || !course.learningMethod || !course.lecturerCode
      );
      console.error('Invalid course data:', invalidCourses);
      return of([]); // Return an empty Observable if data is invalid
    }

    // Use HttpClient to post all valid courses to the server
    const requests = validCourses.map(course => this.http.post<void>(this.apiUrl, course).pipe(
      catchError(this.handleError<void>('initializeCourses'))
    ));
    return forkJoin(requests);
  }

  // Error handling method
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T); // Assume result is undefined if not provided
    };
  }
}

