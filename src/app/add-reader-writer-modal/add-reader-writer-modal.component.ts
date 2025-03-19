import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastController } from "@ionic/angular/standalone"
import { IonModal, IonButton, IonHeader, IonToolbar,  IonButtons, IonTitle, IonContent, IonItem, IonInput, IonGrid, IonCol, IonRow } from '@ionic/angular/standalone';
import { Topic } from '../models/topic';
import { TopicService } from '../services/topic.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';


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
  private toastController = inject(ToastController)
  translate = inject(TranslateService);

  constructor() { }

  ngOnInit() {}

  closeModal(): void {
    this.close.emit();
  }

  onCancel(){
    this.close.emit(); 
  }

  async onAddRead(){
    if (this.topic.readers.includes(this.email)){
      const translatedMessage = await firstValueFrom(
        this.translate.get('USER_ALREADY_READER')
      );      
      const toast = await this.toastController.create({
        message: translatedMessage,
        duration: 1500,
        position: 'bottom',
      });
      await toast.present(); 
    } else if (this.topic.editors.includes(this.email)){
      const translatedMessage = await firstValueFrom(
        this.translate.get('USER_ALREADY_WRITER')
      );       
      const toast = await this.toastController.create({
        message: translatedMessage,
        duration: 1500,
        position: 'bottom',
      });
      await toast.present();
    } else {
      this.topicService.addTopicReader(this.topic,this.email)
      this.close.emit()
    }
  }
  
  async onAddWrite(){

    if (this.topic.readers.includes(this.email)){
      const translatedMessage = await firstValueFrom(
        this.translate.get('USER_ALREADY_READER')
      );       
      const toast = await this.toastController.create({
        message: translatedMessage,
        duration: 1500,
        position: 'bottom',
      });
      await toast.present();
    } else if (this.topic.editors.includes(this.email)){
      const translatedMessage = await firstValueFrom(
        this.translate.get('USER_ALREADY_WRITER')
      );       
      const toast = await this.toastController.create({
        message: translatedMessage,
        duration: 1500,
        position: 'bottom',
      });
      await toast.present();
    } else {
      this.topicService.addTopicWriter(this.topic,this.email)
      this.close.emit() 
    }
    
  }


}
