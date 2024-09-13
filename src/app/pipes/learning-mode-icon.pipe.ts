
import { Pipe, PipeTransform } from '@angular/core';
import { LearningMethod } from '../models/course.model';

@Pipe({
  name: 'learningModeIcon',
  standalone: true
})
export class LearningModeIconPipe implements PipeTransform {
  transform(learningMode: LearningMethod): string {
    console.log('learningMode:', learningMode);    
    switch (learningMode) {
      case 'In-Person':
        return ' In-Preson 🧑‍🏫';  
      case 'Zoom':
        return 'Zoom 💻';  
      default:
        return '';
    }
  }
}
