import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { AllCoursesComponent } from './components/all-courses/all-courses.component';
import { LoginComponent } from './components/login/login.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { EditCourseComponent } from './components/edit-course/edit-course.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';

export const routes: Routes = [

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'all-courses', component: AllCoursesComponent },
    { path: 'add-courses', component: AddCourseComponent },
    { path: 'edit-course/:id', component: EditCourseComponent },
    { path: '**', loadComponent: () => import('./components/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent) }  // טעינה עצלנית של הקומפוננטה


];

