import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { Post } from '../models/post';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { ModalEditionComponent } from "../modal-edition/modal-edition.component";

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    ModalEditionComponent
],
})
export class PostDetailsComponent  implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute)
  private topicService : TopicService = inject(TopicService)
  private router: Router = inject(Router)
  topicId: string = "";
  postId : string = "";
  post : Post| undefined;
  isModalVisible : boolean = false;
  
  constructor() { }
  

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.topicId = params['id'] ?? ""
        this.postId = params['postId'] ?? ""
        this.post = this.topicService.getPost(this.topicId,this.postId)
    });
  }

  goTopic(): void {
    this.router.navigate([`topic/${this.topicId}`])
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
}
