import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent, IonItem, IonInput } from '@ionic/angular/standalone';
import { Topic } from '../models/topic';
import { Post, Posts } from '../models/post';
import { TopicService } from '../services/topic.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';


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

  newEntity: any = { name: '', description: '' };

  constructor(private topicService: TopicService) {}

  closeModal(): void {
    this.close.emit();
  }

  isPostCreation(): boolean {
    return this.topicId.length > 0;
  }

  save(): void {
    if (this.isPostCreation()) {
      const topic = this.topicService.get(this.topicId);
      if (topic) {
        const newPost: Post = {id: '', ...this.newEntity};
        this.topicService.addPost(newPost, this.topicId);
      }
    } else {
      const newTopic: Topic = {id: '', name: this.newEntity.name, posts: []};
      this.topicService.addTopic(newTopic);
    }
    this.newEntity = {name: '', description: ''};
    this.closeModal();
  }
}
