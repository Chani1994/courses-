// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'learningModeIcon',
//   standalone: true
// })
// export class LearningModeIconPipe implements PipeTransform {
//   transform(learningMethod: string): string {
//     if (typeof learningMethod !== 'string') {
//       console.warn('Expected learningMode to be a string but got:', learningMethod);
//       return '🧑‍🏫'; // אייקון ברירת מחדל במקרה של בעיה
//     }
    
//     switch (learningMethod) {
      
//       case 'Zoom':
//         return '💻 '; // אייקון של זום
//       default:
//         return '🏫'; //   אייקון של פרונטלי
//     }
//   }
// }
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
        return '🧑‍🏫'; // אייקון פרונטלי
      case 'Zoom':
        return '💻'; // אייקון זום
      default:
        return '';
    }
  }
}
