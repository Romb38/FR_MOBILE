import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonModal, IonButton, IonHeader, IonToolbar,  IonButtons, IonTitle, IonContent, IonItem, IonInput, IonGrid, IonCol, IonRow } from '@ionic/angular/standalone';
import { Topic } from '../models/topic';
import { TopicService } from '../services/topic.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-add-reader-writer-modal',
  templateUrl: './add-reader-writer-modal.component.html',
  styleUrls: ['./add-reader-writer-modal.component.scss'],
  imports: [
    IonModal, 
    IonHeader,
    IonToolbar,
    IonButton, 
    IonButtons,
    IonTitle, 
    IonContent, 
    IonItem, 
    IonInput, 
    IonGrid, 
    IonCol, 
    IonRow,
    FormsModule, 
    NgIf,
    TranslateModule],
})
export class AddReaderWriterModalComponent  implements OnInit {

  @Input() isVisible: boolean = false;
  @Input() topic: Topic = {} as Topic
  @Output() close = new EventEmitter<void>();
  protected email : string = "";
  private topicService : TopicService = inject(TopicService)

  constructor() { }

  ngOnInit() {}

  closeModal(): void {
    this.close.emit();
  }

  onCancel(){
    this.close.emit(); 
  }

  onAddRead(){
    this.topicService.addTopicReader(this.topic,this.email)
    this.close.emit()
  }
  
  onAddWrite(){
    this.topicService.addTopicWriter(this.topic,this.email)
    this.close.emit()
  }


}
