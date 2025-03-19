import { Component, computed, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Topic } from '../models/topic';
import {IonModal, IonButton, IonHeader, IonToolbar,  IonButtons, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon} from '@ionic/angular/standalone'
import { TopicService } from '../services/topic.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-edit-reader-writer-modal',
  templateUrl: './edit-reader-writer-modal.component.html',
  styleUrls: ['./edit-reader-writer-modal.component.scss'],
  imports: [IonModal, IonHeader, IonToolbar, IonButton, IonButtons, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, TranslateModule]
})
export class EditReaderWriterModalComponent {

  @Input() isVisible: boolean = false;
  @Input() topic: Topic = {} as Topic
  @Output() close = new EventEmitter<void>();
  protected noReader = computed(() => !(this.topic.readers?.length > 0));
  protected noWriter = computed(() => !(this.topic.readers?.length > 0));
  private topicService : TopicService = inject(TopicService)


  constructor() { 
    console.log(this.topic)
  }

  closeModal(): void {
    this.close.emit();
  }

  removeReader(email: string){
    this.topicService.removeTopicReader(this.topic,email)
  }

  removeWriter(email: string){
    this.topicService.removeTopicWriter(this.topic,email)
  }
}
