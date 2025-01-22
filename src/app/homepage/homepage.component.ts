import { Component, inject, OnInit } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { TopicModalCreationComponent } from "../topic-modal-creation/topic-modal-creation.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  imports: [IonItem, IonLabel, IonList, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, TopicModalCreationComponent],
})
export class HomepageComponent  implements OnInit {
  isModalVisible: boolean = false;

  private router: Router = inject(Router)
  protected topicService = inject(TopicService)

  ngOnInit() {
    this.topicService.addTopic({
      id: 't1',
      name: 'This is my first topic',
      posts: [
        {id: 'p1', name: 'Post #1', description: 'This is a description'},
        {id: 'p2', name: 'Post #2', description: 'This is a description'},
      ]
    });
  }
  
  seeDetails(topicId: string): void{
    this.router.navigate(['/topic', topicId]); // Navigue vers /topic/{topicId}
  }

  showModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
