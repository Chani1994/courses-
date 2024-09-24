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

  // קבלת קורס ע"פ קוד
  getCourseById(courseCode: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${courseCode}`).pipe(
      catchError(this.handleError<Course>('getCourseById'))
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
      return of(result as T); 
    };
  }
}

