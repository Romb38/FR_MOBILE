import { Component, inject, Input } from '@angular/core';
import { IonItem, IonIcon, IonList, IonLabel } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular/standalone';
import { TopicService } from '../services/topic.service';
import { addIcons } from 'ionicons';
import { close, create, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-topic-popover',
  templateUrl: './topic-popover.component.html',
  styleUrls: ['./topic-popover.component.scss'],
  imports: [IonItem, IonIcon, IonList, IonLabel, TranslateModule],
})
export class TopicPopoverComponent {
  constructor() {
    addIcons({ create, trashOutline, close });
  }

  @Input() protected topicId: string = ``;
  protected topicService = inject(TopicService);
  private popoverController: PopoverController = inject(PopoverController);

  editTopic() {
    this.popoverController.dismiss({ action: 'edit', topicId: this.topicId });
  }

  deleteTopic() {
    this.popoverController.dismiss({ action: 'delete', topicId: this.topicId });
  }

  dismissPopover() {
    this.popoverController.dismiss();
  }
}
