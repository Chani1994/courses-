import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { AllCoursesComponent } from './components/all-courses/all-courses.component';
import { LoginComponent } from './components/login/login.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { LogoutComponent } from './components/logout/logout.component';
import { EditCourseComponent } from './components/edit-course/edit-course.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';

export const routes: Routes = [

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'all-courses', component: AllCoursesComponent },
    { path: 'add-courses', component: AddCourseComponent },
    { path: 'edit-course/:id', component: EditCourseComponent },

    // { path: 'logout', component: LogoutComponent },

];

