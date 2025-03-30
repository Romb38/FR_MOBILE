import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, inject } from '@angular/core';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonContent,
  IonItem,
  IonInput,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { TopicService } from '../services/topic.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-edition',
  templateUrl: './modal-edition.component.html',
  styleUrls: ['./modal-edition.component.scss'],
  imports: [
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonButtons,
    IonContent,
    IonItem,
    IonInput,
    FormsModule,
    NgIf,
    TranslateModule,
  ],
})
export class ModalEditionComponent implements OnInit, OnDestroy {
  @Input() isVisible: boolean = false;
  @Input() topicId: string = '';
  @Input() postId: string = '';
  @Output() closeEmitter = new EventEmitter<void>();

  private topicService: TopicService = inject(TopicService);
  private destroy$ = new Subject<void>(); // Subject to signal unsubscription.
  protected newEntity: { name: string; description: string } = { name: '', description: '' };

  ngOnInit() {
    if (this.isPostEdition()) {
      this.topicService
        .getPost(this.topicId, this.postId)
        .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when destroy$ emits
        .subscribe({
          next: (post) => {
            if (!post) {
              console.error('no post found');
              this.closeModal();
              return;
            }
            const duplicatedPost = structuredClone(post);
            this.newEntity = {
              name: duplicatedPost.name,
              description: duplicatedPost.description || '',
            };
          },
          error: (err) => {
            console.error('Error loading post:', err);
            this.closeModal();
          },
        });
    } else {
      this.topicService
        .get(this.topicId)
        .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when destroy$ emits
        .subscribe({
          next: (topic) => {
            if (!topic) {
              this.closeModal();
              return;
            }
            const duplicatedTopic = structuredClone(topic);
            this.newEntity = { name: duplicatedTopic.name, description: '' };
          },
          error: (err) => {
            console.error('Error loading topic:', err);
            this.closeModal();
          },
        });
    }
  }

  closeModal(): void {
    this.closeEmitter.emit();
  }

  save(): void {
    if (!this.isFormValid()) {
      return;
    }
    if (this.isPostEdition()) {
      this.topicService
        .getPost(this.topicId, this.postId)
        .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when destroy$ emits
        .subscribe({
          next: (post) => {
            if (!post) {
              this.closeModal();
              return;
            }
            post.name = this.newEntity.name;
            post.description = this.newEntity.description;
            post.timemodified = new Date().toISOString();
            this.topicService.updatePost(post, this.topicId);
            this.closeModal();
          },
          error: (err) => {
            console.error('Error updating post:', err);
            this.closeModal();
          },
        });
    } else {
      this.topicService
        .get(this.topicId)
        .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when destroy$ emits
        .subscribe({
          next: (topic) => {
            if (!topic) {
              this.closeModal();
              return;
            }
            topic.name = this.newEntity.name;
            this.topicService.updateTopic(topic);
            this.closeModal();
          },
          error: (err) => {
            console.error('Error updating topic:', err);
            this.closeModal();
          },
        });
    }
  }

  isPostEdition(): boolean {
    return this.postId.length > 0; // If there's a postId then it's post edition
  }

  isFormValid(): boolean {
    // Check description field for post edition
    if (this.isPostEdition()) {
      const isDescValid: boolean =
        this.newEntity.description?.length >= 4 && this.newEntity.description?.length <= 100;
      if (!isDescValid) {
        return false;
      }
    }

    // Check name field for both topic and post edition
    return this.newEntity.name?.length >= 4 && this.newEntity.name?.length <= 100;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
