import { Router, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';

function isAuth() :  Observable<boolean> {
  const _authService = inject(AuthService)
  const _router = inject(Router)
  return _authService.getConnectedUser().pipe(
    map(user => {
      if (!user) _router.navigateByUrl('/login');
      return !!user;
    })
  )
}

export const routes: Routes = [
  {
    canActivate: [
      () => { return isAuth() }
    ],
    path: '',
    loadComponent: () => import('./homepage/homepage.component').then((m) => m.HomepageComponent),
  },
  { 
    canActivate: [
      () => { return isAuth() }
    ],
    path: 'topic/:id', 
    loadComponent: () => import('./topic-details/topic-details.component').then((m) => m.TopicDetailsComponent),
  },
  {
    canActivate: [
      () => { return isAuth() }
    ],
    path: 'topic/:id/:postId',
    loadComponent: () => import('./post-details/post-details.component').then((m) => m.PostDetailsComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '/404',
  }
];
