import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Lecturer } from '../models/lecturer.model';

@Injectable({
  providedIn: 'root'
})
export class LecturerService {
  private apiUrl = 'http://localhost:3000/lecturers'; 

  constructor(private http: HttpClient) { }

  addLecturer(lecturer: Lecturer, courseName: string): Observable<void> {
    lecturer.courseName = courseName; // עדכון שם הקורס
    return this.http.post<void>(this.apiUrl, lecturer);
  }

  getAllLecturers(): Observable<Lecturer[]> {
    return this.http.get<Lecturer[]>(this.apiUrl);
  }
  getLecturerById(lecturerId: string):Observable<Lecturer | null> {
    return this.http.get<Lecturer>(`${this.apiUrl}/${lecturerId.trim()}`).pipe(
      catchError((error) => {
        console.error('Error fetching lecturer:', error);
        return of(null); 
      })
    );
  }
  getLecturerByCode(code: string): Observable<Lecturer> {
    return this.http.get<Lecturer>(`${this.apiUrl}/${code.trim()}`);
  }
  

}

