import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent, IonItem, IonInput } from '@ionic/angular/standalone';
import { Topic } from '../models/topic';
import { Post, Posts } from '../models/post';
import { TopicService } from '../services/topic.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-modal-creation',
  templateUrl: './modal-creation.component.html',
  styleUrls: ['./modal-creation.component.scss'],
  imports: [IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent, IonItem, IonInput, FormsModule, NgIf],
})
export class ModalCreationComponent {
  @Input() isVisible: boolean = false;
  @Input() topicId: string = '';
  @Output() close = new EventEmitter<void>();

  private topicService: TopicService = inject(TopicService);
  protected newEntity: { name: '', description: '' } = { name: '', description: '' };

  closeModal(): void {
    this.close.emit();
  }

  isPostCreation(): boolean {
    return this.topicId.length > 0;
  }

  save(): void {
    if (!this.isFormValid()) {
      return;
    }
    if (this.isPostCreation()) {
      const topic = this.topicService.get(this.topicId);
      if (topic) {
        const newPost: Post = {id: '', name: this.newEntity.name, description: this.newEntity.description};
        this.topicService.addPost(newPost, this.topicId);
      }
    } else {
      const newTopic: Topic = {id: '', name: this.newEntity.name, posts: []};
      this.topicService.addTopic(newTopic);
    }
    this.resetFormValues();
    this.closeModal();
  }

  isFormValid(): boolean {
    return (
      this.newEntity.name.length >= 4 && this.newEntity.name.length <= 100 &&
      (!this.isPostCreation() || (this.newEntity.description.length >= 4 && this.newEntity.description.length <= 100))
    );
  }

  resetFormValues(): void {
    this.newEntity = {name: '', description: ''};
  }
}
