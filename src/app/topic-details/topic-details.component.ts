import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonItem,
  IonLabel,
  IonList,
  IonContent,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonAvatar,
} from '@ionic/angular/standalone';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { Post, Posts } from '../models/post';
import { ModalCreationComponent } from '../modal-creation/modal-creation.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { Observable, of, Subject, switchMap, tap } from 'rxjs';
import { AsyncPipe, LowerCasePipe, NgForOf, NgIf, SlicePipe } from '@angular/common';
import { EditReaderWriterModalComponent } from '../edit-reader-writer-modal/edit-reader-writer-modal.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { shareSocial, create } from 'ionicons/icons';
import { ModalEditionComponent } from '../modal-edition/modal-edition.component';
import { AvatarService } from '../services/avatar.service';
import { DateService } from '../services/date.service';
import { catchError, takeUntil } from 'rxjs/operators';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss'],
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonItem,
    IonLabel,
    IonList,
    IonContent,
    IonButton,
    IonIcon,
    ModalCreationComponent,
    TopBarComponent,
    AsyncPipe,
    EditReaderWriterModalComponent,
    TranslateModule,
    ModalEditionComponent,
    IonAvatar,
    LowerCasePipe,
    SlicePipe,
    NgIf,
    NgForOf,
  ],
})
export class TopicDetailsComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  protected topicService: TopicService = inject(TopicService);
  protected avatarService: AvatarService = inject(AvatarService);
  protected dateService: DateService = inject(DateService);
  private translate: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  private actionSheetCtrl = inject(ActionSheetController);
  private destroy$: Subject<void> = new Subject<void>();

  topicId: string = '';
  topic$: Observable<Topic | undefined> = new Observable<Topic | undefined>();
  topic: Topic = {} as Topic;
  postId: string = '';
  posts: Observable<Posts> = new Observable();
  isPostCreationModalVisible: boolean = false;
  isPostEditModalVisible: boolean = false;
  isEditReaderWriterModalVisible: boolean = false;

  constructor() {
    addIcons({ shareSocial, create });
  }

  ngOnInit() {
    this.topic$ = this.route.params.pipe(
      switchMap((params) => {
        this.topicId = params['id'] ?? '';
        return this.topicService.get(this.topicId);
      }),
      tap((topic) => {
        console.debug('Received topic:', topic);

        if (!topic) {
          this.router.navigate(['404']);
        } else {
          this.topic = topic;
          this.posts = this.topicService.getAllPosts(this.topicId);
        }
      })
    );

    // Subscribe to the topic$ observable to trigger the side effects.
    this.topic$.subscribe();
  }

  editPost(id: string) {
    this.postId = id;
    this.isPostEditModalVisible = true;
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
        this.postId = '';
      });
  }

  handleRefresh(event: { target: { complete: () => void } }) {
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  deletePost(post: Post): void {
    this.topicService.removePost(post.id, this.topicId);
    this.router.navigate(['/']);
  }

  showModal() {
    this.isPostCreationModalVisible = true;
  }

  closePostCreationModal() {
    this.isPostCreationModalVisible = false;
  }

  showEditReaderWriterModal() {
    this.isEditReaderWriterModalVisible = true;
  }

  closeEditReaderWriterModal() {
    this.isEditReaderWriterModalVisible = false;
  }

  closePostEditModal() {
    this.postId = '';
    setTimeout(() => {
      this.isPostEditModalVisible = false;
    }, 10); // Patch: small delay to first update visible state and then remove the component
  }

  trackByPostId(index: number, item: Post): string {
    return item.id;
  }

  async presentPostActionSheet(post: Post) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('POST') + ': ' + post.description,
      buttons: [
        {
          text: this.translate.instant('EDIT'),
          icon: 'create',
          handler: () => this.editPost(post.id),
        },
        {
          text: this.translate.instant('DELETE'),
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => this.deletePost(post),
        },
        {
          text: this.translate.instant('CANCEL'),
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
}
