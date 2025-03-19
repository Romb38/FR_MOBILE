import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Topic } from '../models/topic';
import {IonModal, IonButton, IonHeader, IonToolbar,  IonButtons, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon} from '@ionic/angular/standalone'
import { TopicService } from '../services/topic.service';


@Component({
  selector: 'app-edit-reader-writer-modal',
  templateUrl: './edit-reader-writer-modal.component.html',
  styleUrls: ['./edit-reader-writer-modal.component.scss'],
  imports: [IonModal, IonHeader, IonToolbar, IonButton, IonButtons, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon]
})
export class EditReaderWriterModalComponent  implements OnInit {

  @Input() isVisible: boolean = false;
  @Input() topic: Topic = {} as Topic
  @Output() close = new EventEmitter<void>();
  protected noReader : boolean = true
  protected noWriter : boolean = true
  private topicService : TopicService = inject(TopicService)

  constructor() { }

  ngOnInit() {
    this.noReader = !(this.topic.readers.length > 0);
    this.noWriter = !(this.topic.editors.length > 0)
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
