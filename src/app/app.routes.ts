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
];
