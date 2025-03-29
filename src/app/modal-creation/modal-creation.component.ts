import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent, IonItem, IonInput } from '@ionic/angular/standalone';
import { Topic } from '../models/topic';
import { Post } from '../models/post';
import { TopicService } from '../services/topic.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {AuthService} from '../services/auth.service';
import {firstValueFrom} from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-modal-creation',
  templateUrl: './modal-creation.component.html',
  styleUrls: ['./modal-creation.component.scss'],
  imports: [IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent, IonItem, IonInput, FormsModule, NgIf, TranslateModule],
})
export class ModalCreationComponent {
  @Input() isVisible: boolean = false;
  @Input() topicId: string = '';
  @Output() close = new EventEmitter<void>();

  private topicService: TopicService = inject(TopicService);
  private authService: AuthService = inject(AuthService);
  protected newEntity: { name: '', description: '' } = { name: '', description: '' };

  closeModal(): void {
    this.close.emit();
  }

  isPostCreation(): boolean {
    return this.topicId.length > 0;
  }

  async save(): Promise<void> {
    if (!this.isFormValid()) {
      return;
    }
    const author = await firstValueFrom(this.authService.getConnectedUser());
    if (this.isPostCreation()) {
      const topic = this.topicService.get(this.topicId);
      if (topic) {
        const newPost: Post = {
          id: '',
          name: this.newEntity.name,
          description: this.newEntity.description,
          author: author!.uid,
          timecreated: new Date().toISOString(),
          timemodified: null,
        };
        this.topicService.addPost(newPost, this.topicId);
      }
    } else {
      const newTopic: Topic = {
        id: '',
        name: this.newEntity.name,
        posts: [],
        author: author!.uid,
        editors : [],
        readers : []
      };
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
