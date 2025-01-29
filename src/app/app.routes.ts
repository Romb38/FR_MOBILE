import { Routes } from '@angular/router';
import { TopicDetailsComponent } from './topic-details/topic-details.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { NotFoundComponent } from './not-found/not-found.component';

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
  { 
    path: 'topic/:id', 
    component: TopicDetailsComponent 
  },
  {
    path: 'topic/:id/:postId',
    component : PostDetailsComponent
  },
  {
    path: '404',
    component : NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/404',
  }
];
