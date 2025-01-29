import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonItem, IonLabel, IonList, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { Post } from '../models/post';
import { ModalCreationComponent } from "../modal-creation/modal-creation.component";
import { TopBarComponent } from "../top-bar/top-bar.component";

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss'],
  imports: [
    IonItem,
    IonLabel,
    IonList,
    IonContent,
    IonButton,
    IonIcon,
    ModalCreationComponent,
    TopBarComponent
],

})
export class TopicDetailsComponent  implements OnInit {

  constructor() { }

  private route: ActivatedRoute = inject(ActivatedRoute)
  private topicService : TopicService = inject(TopicService)
  private router: Router = inject(Router)
  topicId: string = "";
  topic: Topic = {} as Topic
  isModalVisible: boolean = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
         this.topicId = params['id'] ?? ""
         this.topic = this.topicService.get(this.topicId)

    });
  }


  goToPost(post : Post) : void {
    this.router.navigate([`topic/${this.topicId}/${post.id}`]);
  }

  deleteItem(post : Post): void {
    this.topicService.removePost(post,this.topicId)
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

}
