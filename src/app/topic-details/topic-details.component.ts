import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonItem, IonLabel, IonList, IonContent, IonButton, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { Post, Posts } from '../models/post';
import { ModalCreationComponent } from "../modal-creation/modal-creation.component";
import { TopBarComponent } from "../top-bar/top-bar.component";
import { Observable, switchMap } from 'rxjs';
import {AsyncPipe } from '@angular/common';
import { AddReaderWriterModalComponent } from "../add-reader-writer-modal/add-reader-writer-modal.component";
import { EditReaderWriterModalComponent } from "../edit-reader-writer-modal/edit-reader-writer-modal.component";
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { shareSocial, create } from 'ionicons/icons';


@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss'],
  imports: [IonRefresherContent, IonRefresher, 
    IonItem,
    IonLabel,
    IonList,
    IonContent,
    IonButton,
    IonIcon,
    ModalCreationComponent,
    TopBarComponent,
    AsyncPipe,
    AddReaderWriterModalComponent,
    EditReaderWriterModalComponent,
    TranslateModule
],
})
export class TopicDetailsComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  protected topicService: TopicService = inject(TopicService);
  private router: Router = inject(Router);

  topicId: string = '';
  topic$: Observable<Topic | undefined> = new Observable<Topic | undefined>();
  topic : Topic = {} as Topic
  posts : Observable<Posts> = new Observable;
  isModalVisible: boolean = false;
  isReaderWriterModalVisible : boolean = false;
  isEditReaderWriterModalVisible : boolean = false;

  constructor(){
    addIcons({shareSocial,create})
  }

  ngOnInit() {
    this.topic$ = this.route.params.pipe(
      // Retrieve the topic directly from the topic service.
      switchMap((params) => {
        this.topicId = params['id'] ?? '';
        return this.topicService.get(this.topicId);
      })
    );

    // Redirect to 404 if the topic is not found.
    this.topic$.subscribe((topic) => {
      console.debug('Received updated topic:', topic);

      if (!topic) {
        this.router.navigate(['404']);
      } else {
        this.topic = topic;
      }
    });

    this.posts = this.topicService.getAllPost(this.topicId);
  }

  handleRefresh(event: any) {
    console.debug("Page rafraîchie !");
    window.location.reload();
  
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  

  goToPost(post: Post): void {
    this.router.navigate([`topic/${this.topicId}/${post.id}`]);
  }

  deleteItem(post: Post): void {
    this.topicService.removePost(post.id, this.topicId);
    this.router.navigate(['/'])
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  showReadWriteModal(){
    this.isReaderWriterModalVisible = true;
  }

  closeReadWriteModal(){
    this.isReaderWriterModalVisible = false;
  }

  showEditReaderWriterModal(){
    this.isEditReaderWriterModalVisible = true;
  }

  closeEditReaderWriterModal(){
    this.isEditReaderWriterModalVisible = false;
  }

  trackByPostId(index: number, item: Post): string {
    return item.id;
  }
}
