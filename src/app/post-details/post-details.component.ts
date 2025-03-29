import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { takeUntil, catchError, map } from 'rxjs/operators';
import { TopicService } from '../services/topic.service';
import { Post } from '../models/post';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { ModalEditionComponent } from '../modal-edition/modal-edition.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { Topic } from '../models/topic';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
  imports: [IonContent, IonButton, ModalEditionComponent, TopBarComponent, TranslateModule],
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  private route: ActivatedRoute = inject(ActivatedRoute);
  protected topicService: TopicService = inject(TopicService);
  private router: Router = inject(Router);
  private destroy$: Subject<void> = new Subject<void>();

  topicId: string = '';
  topic: Topic = {} as Topic;
  postId: string = '';
  post: Post = {} as Post;
  isModalVisible: boolean = false;

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.topicId = params['id'] ?? '';
      this.postId = params['postId'] ?? '';

      this.topicService
        .get(this.topicId)
        .pipe(
          map((topic) => {
            if (topic) {
              this.topic = topic;
            }
          })
        )
        .subscribe();

      this.updatePost();
    });
  }

  updatePost() {
    this.topicService
      .getPost(this.topicId, this.postId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.router.navigate(['404']);
          return of(undefined);
        })
      )
      .subscribe((post: Post | undefined) => {
        if (!post) {
          this.router.navigate(['404']);
          return;
        }
        this.post = post;
      });
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.updatePost();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
