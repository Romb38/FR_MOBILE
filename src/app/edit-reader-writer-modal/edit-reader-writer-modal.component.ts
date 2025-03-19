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
export class EditReaderWriterModalComponent implements OnInit{

  @Input() isVisible: boolean = false;
  @Input() topicId : string = ""
  @Output() close = new EventEmitter<void>();
  protected reader : string[] = [];
  protected editors : string[] = [];
  protected topic : Topic = {} as Topic;
  private topicService : TopicService = inject(TopicService)

  ngOnInit(){
    this.topicService.get(this.topicId).subscribe((topic) => {
      if(topic){
        this.topic = topic
        this.reader = this.topic.readers;
        this.editors = this.topic.editors
      }
    })
  }

  closeModal(): void {
    this.close.emit();
  }

  removeReader(email: string){
    this.topic.readers = this.topic.readers.filter(reader => reader !== email);
    this.topicService.removeTopicReader(this.topic,email)
    this.topicService.get(this.topicId).subscribe((topic) => {
      if(topic){
        this.topic = topic
        this.reader = this.topic.readers;
        this.editors = this.topic.editors
      }
    })
  }

  removeWriter(email: string){
    this.topic.editors = this.topic.editors.filter(editors => editors !== email);
    this.topicService.removeTopicWriter(this.topic,email)
    this.topicService.get(this.topicId).subscribe((topic) => {
      if(topic){
        this.topic = topic
        this.reader = this.topic.readers;
        this.editors = this.topic.editors
      }
    })
  }
}
