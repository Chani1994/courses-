import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard'; // ודא שהנתיב נכון

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard] // ודא שה-AuthGuard מסופק כאן
    });

    guard = TestBed.inject(AuthGuard); // השתמש ב-inject כדי לקבל את ה-guard
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // תוספת בדיקות עבור AuthGuard:
  it('should allow access if authenticated', () => {
    // כאן תוכל להוסיף את הבדיקות שלך אם ה-guard מאשר גישה
    // נניח שיש לך service עם מתודת isAuthenticated
    // spyOn(authService, 'isAuthenticated').and.returnValue(true);
    // expect(guard.canActivate()).toBe(true);
  });

  it('should deny access and redirect if not authenticated', () => {
    // כאן תוכל להוסיף את הבדיקות שלך אם ה-guard מונע גישה
    // spyOn(authService, 'isAuthenticated').and.returnValue(false);
    // expect(guard.canActivate()).toBe(false);
  });
});
