import { Category } from "./category.model";

export enum LearningMethod {
 'In-Person'  = 'In-Person',
  'Zoom' = 'Zoom'
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