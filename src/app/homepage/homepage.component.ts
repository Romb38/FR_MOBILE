import { Component, inject } from '@angular/core';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { TopicService } from '../services/topic.service';
import {
  IonItem,
  IonLabel,
  IonList,
  IonContent,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { ModalCreationComponent } from '../modal-creation/modal-creation.component';
import { Router } from '@angular/router';
import { Topic, Topics } from '../models/topic';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { create, trashOutline } from 'ionicons/icons';
import { ModalEditionComponent } from '../modal-edition/modal-edition.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonItem,
    IonLabel,
    IonList,
    IonButton,
    IonContent,
    IonIcon,
    ModalCreationComponent,
    AsyncPipe,
    IonButton,
    TranslateModule,
    TopBarComponent,
    ModalEditionComponent,
    NgIf,
  ],
})
export class HomepageComponent {
  isCreateTopicModalVisible: boolean = false;
  isEditTopicModalVisible: boolean = false;

  private router: Router = inject(Router);
  protected topicService = inject(TopicService);
  protected auth: AuthService = inject(AuthService);
  topics: Observable<Topics> = this.topicService.getAll();
  public topicId: string = '';

  constructor() {
    addIcons({ trashOutline, create });
  }

  handleRefresh(event: { target: { complete: () => void } }) {
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  seeDetails(topicId: string): void {
    this.router.navigate(['/topic', topicId]); // Navigue vers /topic/{topicId}
  }

  showCreateTopicModal(): void {
    this.isCreateTopicModalVisible = true;
  }

  closeCreateTopicModal(): void {
    this.isCreateTopicModalVisible = false;
  }

  showEditTopicModal(): void {
    this.isEditTopicModalVisible = true;
  }

  closeEditTopicModal(): void {
    this.topicId = '';
    setTimeout(() => {
      this.isEditTopicModalVisible = false;
    }, 10); // Patch: small delay to first update visible state and then remove the component
  }

  editPost(topicId: string): void {
    this.topicId = topicId;
    this.showEditTopicModal();
  }

  deleteItem(topic: Topic): void {
    this.topicService.removeTopic(topic);
    this.router.navigate(['/']);
  }
}
