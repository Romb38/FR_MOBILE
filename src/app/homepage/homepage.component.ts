import { Component, inject, OnInit } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ModalCreationComponent } from "../modal-creation/modal-creation.component";
import { Router } from '@angular/router';
import { Topic, Topics } from '../models/topic';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  imports: [
    IonItem,
    IonLabel,
    IonList,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    ModalCreationComponent,
    AsyncPipe
],
})
export class HomepageComponent {
  isModalVisible: boolean = false;
  
  private router: Router = inject(Router);
  protected topicService = inject(TopicService);
  topics: Observable<Topics> = this.topicService.getAll();;

  seeDetails(topicId: string): void{
    this.router.navigate(['/topic', topicId]); // Navigue vers /topic/{topicId}
  }

  showModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  deleteItem(topic : Topic): void {
    this.topicService.removeTopic(topic)
  }
}
