
import { Pipe, PipeTransform } from '@angular/core';
import { LearningMethod } from '../models/course.model';

@Pipe({
  name: 'learningModeIcon',
  standalone: true
})
export class LearningModeIconPipe implements PipeTransform {
  transform(learningMode: LearningMethod): string {
    console.log('learningMode:', learningMode); // הוסף בדיקה זו
    switch (learningMode) {
      case 'In-Person':
        return ' פרונטלי 🧑‍🏫'; // אייקון פרונטלי
      case 'Zoom':
        return 'זום 💻'; // אייקון זום
      default:
        return '';
    }
  }
}
