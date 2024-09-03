import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; // ייבוא CommonModule

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule], // הוספת CommonModule לרשימת הייבוא
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'] // תיקון לשם המאפיין הנכון
})
export class NavbarComponent {
  constructor(private router: Router, private authService: AuthService) {}

  onLogout(): void {
    // שאל את המשתמש אם הוא מעוניין להתנתק
    const confirmLogout = confirm('Are you sure you want to log out?');
    
    if (confirmLogout) {
      // נתק את המשתמש באמצעות השירות
      this.authService.logout();
  
      // ניווט לקומפוננטת ההתחברות
      this.router.navigate(['/login']);
    }
    // אם המשתמש ענה "לא", לא נעשה כלום והמשתמש יישאר באתר
  }
}
