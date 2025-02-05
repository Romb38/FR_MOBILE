import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { Post } from '../models/post';
import {IonContent, IonButton} from '@ionic/angular/standalone';
import { ModalEditionComponent } from "../modal-edition/modal-edition.component";
import { TopBarComponent } from "../top-bar/top-bar.component";

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
  imports: [
    IonContent,
    IonButton,
    ModalEditionComponent,
    TopBarComponent
],
})
export class PostDetailsComponent implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private topicService: TopicService = inject(TopicService);
  private router: Router = inject(Router);
  topicId: string = "";
  postId: string = "";
  post: Post = {} as Post;
  isModalVisible: boolean = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.topicId = params['id'] ?? "";
      this.postId = params['postId'] ?? "";

      this.topicService.getPost(this.topicId, this.postId).subscribe(post => {
        if (typeof post === undefined || !post) {
          this.router.navigate(['404']);
          console.debug('post not found');
        }
        this.post = post as Post;
        console.debug('post found!');
      });
    });
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
}
