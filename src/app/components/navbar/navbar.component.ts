import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, map } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  firstLetter$: Observable<string | null>;
  isAuthenticated$: Observable<boolean>;
  username$: Observable<string | null>;
  currentUser: User | null = null; // הוסף את המאפיין הזה
  private subscriptions: Subscription = new Subscription();
  constructor(private router: Router, public authService: AuthService,    private cdr: ChangeDetectorRef
    ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.username$ = this.authService.currentUser$.pipe(
      map(user => user ? user.username : null)
    );
    this.firstLetter$ = this.username$.pipe(map(username => username ? username[0] : null));
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.currentUser$.subscribe((user: User | null) => {
        this.currentUser = user; // עדכן את המשתנה
      })
    );
  }

  ngOnDestroy(): void {
    // נקה את המנוי כאשר הקומפוננטה נהרסת
    this.subscriptions.unsubscribe();
  }
  
  onLogout(): void {
    const confirmLogout = confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      this.authService.logout();
      sessionStorage.removeItem('jwtToken');
      sessionStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }
  }
}
