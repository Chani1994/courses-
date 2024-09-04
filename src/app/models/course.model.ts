import { Category } from "./category.model";

export enum LearningMethod {
  'Zoom' = 'Zoom',
  'In-Person'  = 'In-Person'

  }
  
  export class Course {
    constructor(
      public courseCode: string,
      public courseName: string,
      public numberOfLessons: number,
      public startDate: Date,
      public syllabus: string[],
      public learningMethod: LearningMethod,
      public lecturerCode: string,
      public imagePath: string,
      public category: Category // הקטגוריה
    ) {}
  }