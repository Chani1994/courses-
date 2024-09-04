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
  private defaultCourses: Course[] = [
    { category: { code: '001', name: 'הוראה', iconPath: 'assets/images/teach-1968076_1280.jpg' }, courseCode: 'DEF001', courseName: 'קורס אנגלית ', numberOfLessons: 10, startDate: new Date('2024-09-25'), syllabus: ['מבוא להוראה'], learningMethod: LearningMethod.Zoom, lecturerCode: 'משה', imagePath: 'assets/images/english-british-england-language-education-concept.jpg' },
    { category: { code: '002', name: 'יצירה ואומנות', iconPath: 'assets/images/hand-4752642_1280.jpg' }, courseCode: 'DEF002', courseName: 'תפירה למתחילים', numberOfLessons: 5, startDate: new Date('2024-09-15'), syllabus: ['יסודות התפירה'], learningMethod: LearningMethod["In-Person"], lecturerCode: 'משה', imagePath: 'assets/images/top-view-variety-fabrics-with-thread-scissors.jpg' },
    { category: { code: '003', name: 'מחשבים', iconPath: 'assets/images/pexels-pixabay-38568.jpg' }, courseCode: 'DEF003', courseName: 'קורס אדריכלות', numberOfLessons: 12, startDate: new Date('2024-10-30'), syllabus: [' מבוא לאדריכלות'], learningMethod: LearningMethod.Zoom, lecturerCode: 'משה', imagePath: 'assets/images/high-angle-architectural-objects-desk.jpg' },
    { category: { code: '004', name: 'רפואה', iconPath: 'assets/images/syringes-3539565_1280.jpg' }, courseCode: 'DEF004', courseName: 'מזכירות רפואית', numberOfLessons: 8, startDate: new Date('2024-09-30'), syllabus: ['יסודות הרפואה'], learningMethod: LearningMethod["In-Person"], lecturerCode: 'משה', imagePath: 'assets/images/cold-1972619_1280.jpg' },
  ];

  constructor(private http: HttpClient) {}

  // Method to get all courses, with optional token for authentication
  getAllCourses(token?: string): Observable<Course[]> {
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
    return this.http.get<Course[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError<Course[]>('getAllCourses', []))
    );
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

  // בדיקת קורסי ברירת מחדל
  checkAndInitializeDefaultCourses(): Observable<void> {
    return this.getAllCourses().pipe(
      mergeMap(courses => {
        if (courses.length === 0) {
          return this.initializeCourses(this.defaultCourses).pipe(
            map(() => undefined) // המרה של Observable<void[]> ל-Observable<void>
          );
        }
        return of(undefined); // במקרה שיש כבר קורסים, חזור על Observable<void> ריק
      }),
      catchError(this.handleError<void>('checkAndInitializeDefaultCourses'))
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

