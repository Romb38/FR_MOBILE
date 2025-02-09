import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonItem, IonLabel, IonList, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { Post } from '../models/post';
import { ModalCreationComponent } from "../modal-creation/modal-creation.component";
import { TopBarComponent } from "../top-bar/top-bar.component";
import { Observable, switchMap } from 'rxjs';
import {AsyncPipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss'],
  imports: [
    IonItem,
    IonLabel,
    IonList,
    IonContent,
    IonButton,
    IonIcon,
    ModalCreationComponent,
    TopBarComponent,
    NgForOf,
    AsyncPipe,
  ],
})
export class TopicDetailsComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private topicService: TopicService = inject(TopicService);
  private router: Router = inject(Router);

  topicId: string = '';
  topic$: Observable<Topic | undefined> = new Observable<Topic | undefined>();
  isModalVisible: boolean = false;

  ngOnInit() {
    this.topic$ = this.route.params.pipe(
      // Retrieve the topic directly from the topic service.
      switchMap((params) => {
        this.topicId = params['id'] ?? '';
        return this.topicService.get(this.topicId);
      })
    );

    // Redirect to 404 if the topic is not found.
    this.topic$.subscribe((topic) => {
      console.debug('Received updated topic:', topic);
      if (!topic) {
        this.router.navigate(['404']);
      }
    });
  }

  goToPost(post: Post): void {
    this.router.navigate([`topic/${this.topicId}/${post.id}`]);
  }

  deleteItem(post: Post): void {
    this.topicService.removePost(post.id, this.topicId);
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  trackByPostId(index: number, item: Post): string {
    return item.id;
  }
}
