import { Component, inject, OnInit } from '@angular/core';
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
  IonSearchbar,
} from '@ionic/angular/standalone';
import { ModalCreationComponent } from '../modal-creation/modal-creation.component';
import { Router } from '@angular/router';
import { Topic, Topics } from '../models/topic';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeOutline, create, ellipsisVerticalOutline, trashOutline } from 'ionicons/icons';
import { ModalEditionComponent } from '../modal-edition/modal-edition.component';
import { PopoverController } from '@ionic/angular/standalone';
import { DateService } from '../services/date.service';
import { TranslateConfigService } from '../services/translate-config.service';
import { TopicPopoverComponent } from '../topic-popover/topic-popover.component';

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
    IonSearchbar,
  ],
})
export class HomepageComponent implements OnInit {
  isCreateTopicModalVisible: boolean = false;
  isEditTopicModalVisible: boolean = false;

  private router: Router = inject(Router);
  protected topicService = inject(TopicService);
  protected auth: AuthService = inject(AuthService);
  protected dateService: DateService = inject(DateService);
  protected searchValue: string = '';
  private popoverController = inject(PopoverController);
  topics: Observable<Topics> = this.topicService.getAll();
  public topicId: string = '';
  protected language: string = 'en';
  private translateConfigService: TranslateConfigService = inject(TranslateConfigService);

  constructor() {
    addIcons({ trashOutline, create, ellipsisVerticalOutline, closeOutline });
  }

  public ngOnInit() {
    this.language = this.translateConfigService.getCurrentLang();
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

  editTopic(topicId: string): void {
    this.topicId = topicId;
    this.showEditTopicModal();
  }

  deleteTopic(topic: Topic): void {
    this.topicService.removeTopic(topic);
    this.router.navigate(['/']);
  }

  async presentActionSheet(topic: Topic) {
    const popover = await this.popoverController.create({
      component: TopicPopoverComponent,
      componentProps: {
        topicId: topic.id,
      },
      translucent: true,
    });

    popover.onDidDismiss().then((result) => {
      if (result.data) {
        this.handleTopicAction(result.data);
      }
    });

    await popover.present();
  }

  handleTopicAction(actionData: { action: string; topicId: string }) {
    if (actionData.action === 'edit') {
      this.editTopic(actionData.topicId);
    } else if (actionData.action === 'delete') {
      this.topicService.get(actionData.topicId).subscribe((topic: Topic | undefined) => {
        if (topic) {
          this.deleteTopic(topic);
        }
      });
    }
  }

  handleSearchBarInput(event: CustomEvent) {
    this.searchValue = event.detail.value?.toLowerCase() || '';
  }
}
