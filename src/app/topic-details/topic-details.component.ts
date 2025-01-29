import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { Post } from '../models/post';
import { ModalCreationComponent } from "../modal-creation/modal-creation.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss'],
  imports: [
    IonItem,
    IonLabel,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    ModalCreationComponent,
    NgIf
],

})
export class TopicDetailsComponent  implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private topicService : TopicService = inject(TopicService);
  private router: Router = inject(Router);
  topicId: string = "";
  topic: Topic = {} as Topic;
  isModalVisible: boolean = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.topicId = params['id'] ?? '';
      if (this.topicId) {
        this.topic = this.topicService.get(this.topicId);
      }
    });
    console.log('ngOnInit');
    console.log(this.topic);
  }

  goHome(): void {
    this.router.navigate([""])
  }

  deleteItem(post: Post): void {
    this.topicService.removePost(post,this.topicId)
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

}
