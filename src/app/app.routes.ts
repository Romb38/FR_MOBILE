import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./homepage/homepage.component').then((m) => m.HomepageComponent),
  },
  { 
    path: 'topic/:id', 
    loadComponent: () => import('./topic-details/topic-details.component').then((m) => m.TopicDetailsComponent),
  },
  {
    path: 'topic/:id/:postId',
    loadComponent: () => import('./post-details/post-details.component').then((m) => m.PostDetailsComponent),
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
