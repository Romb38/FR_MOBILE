import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent, IonItem, IonInput } from '@ionic/angular/standalone';
import { Topic } from '../models/topic';
import { Posts } from '../models/post';
import { TopicService } from '../services/topic.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-topic-modal-creation',
  templateUrl: './topic-modal-creation.component.html',
  styleUrls: ['./topic-modal-creation.component.scss'],
  imports: [IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent, IonItem, IonInput, FormsModule],
})
export class TopicModalCreationComponent  implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  newTopic: Topic = { id: '', name: '', posts: {} as Posts };

  constructor(private topicService: TopicService) {}

  ngOnInit() {}

  closeModal(): void {
    this.close.emit();
  }

  save(): void {
    this.topicService.addTopic(this.newTopic);
    this.newTopic = { id: '', name: '', posts: {} as Posts };
    this.closeModal();
  }
}
