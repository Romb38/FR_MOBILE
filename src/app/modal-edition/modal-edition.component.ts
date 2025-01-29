import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent, IonItem, IonInput } from '@ionic/angular/standalone';
import { Post } from '../models/post';
import { FormsModule } from '@angular/forms';
import { TopicService } from '../services/topic.service';


@Component({
  selector: 'app-modal-edition',
  templateUrl: './modal-edition.component.html',
  styleUrls: ['./modal-edition.component.scss'],
  imports: [IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent, IonItem, IonInput, FormsModule],

})
export class ModalEditionComponent implements OnInit {

  @Input() isVisible: boolean = false;
  @Input() topicId: string = '';
  @Input() postId: string = '';
  @Output() close = new EventEmitter<void>();

  newEntity : Post = {} as Post

  constructor(private topicService: TopicService) {}

  ngOnInit() {
    let entity : Post | undefined = this.topicService.getPost(this.topicId,this.postId)
    if (!entity){
      this.closeModal()
    } else {
      this.newEntity = structuredClone(entity)
      console.log(this.newEntity)
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  save(): void {
    this.topicService.editPost(this.newEntity,this.topicId)
    this.closeModal();
  }

}
