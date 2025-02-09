import {Component, EventEmitter, Input, OnInit, Output, OnDestroy, inject} from '@angular/core';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonContent,
  IonItem,
  IonInput
} from '@ionic/angular/standalone';
import { Post } from '../models/post';
import { FormsModule } from '@angular/forms';
import { TopicService } from '../services/topic.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-modal-edition',
  templateUrl: './modal-edition.component.html',
  styleUrls: ['./modal-edition.component.scss'],
  imports: [IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent, IonItem, IonInput, FormsModule],
})
export class ModalEditionComponent implements OnInit, OnDestroy {
  @Input() isVisible: boolean = false;
  @Input() topicId: string = '';
  @Input() postId: string = '';
  @Output() close = new EventEmitter<void>();

  private topicService: TopicService = inject(TopicService);
  private destroy$ = new Subject<void>(); // Subject to signal unsubscription.
  protected newEntity: Post = {} as Post;

  ngOnInit() {
    this.topicService.getPost(this.topicId, this.postId)
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when the destroy$ emits.
      .subscribe({
        next: (post) => {
          if (!post) {
            this.closeModal();
            return;
          }
          this.newEntity = structuredClone(post);
        },
        error: (err) => {
          console.error('Error loading post:', err);
          this.closeModal();
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(); // Notify all subscriptions to clean up.
    this.destroy$.complete(); // Complete the subject.
  }

  closeModal(): void {
    this.close.emit();
  }

  save(): void {
    this.topicService.editPost(this.newEntity, this.topicId);
    this.closeModal();
  }
}
