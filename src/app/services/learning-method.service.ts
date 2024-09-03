import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LearningMethod } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class LearningMethodService {
  private learningMethods = Object.values(LearningMethod); // המרת ה-enum למערך

  constructor() { }

  getAllLearningMethods(): Observable<LearningMethod[]> {
    return of(this.learningMethods); // החזרת המערך כהשבה של Observable
  }

  getLearningMethodByCode(code: string): Observable<LearningMethod | undefined> {
    const method = this.learningMethods.find(m => m === code);
    return of(method);
  }
}
