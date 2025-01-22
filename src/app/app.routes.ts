import { Routes } from '@angular/router';
import { TopicDetailsComponent } from './topic-details/topic-details.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./homepage/homepage.component').then((m) => m.HomepageComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'topic/:id', component: TopicDetailsComponent },
];
