import { Router, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';

function isAuth(): Observable<boolean> {
  const _authService = inject(AuthService);
  const _router = inject(Router);
  return _authService.getConnectedUser().pipe(
    map((user) => {
      if (!user) _router.navigateByUrl('/login');
      return !!user;
    })
  );
}

export const routes: Routes = [
  {
    canActivate: [
      () => {
        return isAuth();
      },
    ],
    path: '',
    loadComponent: () => import('./homepage/homepage.component').then((m) => m.HomepageComponent),
  },
  {
    canActivate: [
      () => {
        return isAuth();
      },
    ],
    path: 'topic/:id',
    loadComponent: () =>
      import('./topic-details/topic-details.component').then((m) => m.TopicDetailsComponent),
  },
  {
    canActivate: [
      () => {
        return isAuth();
      },
    ],
    path: 'me',
    loadComponent: () =>
      import('./account-infos/account-infos.component').then((m) => m.AccountInfosComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register-page.component').then((m) => m.RegisterPageComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password-page.component').then(
        (m) => m.ForgotPasswordPageComponent
      ),
  },
  {
    path: 'error-report',
    loadComponent: () =>
      import('./error-report/error-report.component').then((m) => m.ErrorReportComponent),
  },
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
