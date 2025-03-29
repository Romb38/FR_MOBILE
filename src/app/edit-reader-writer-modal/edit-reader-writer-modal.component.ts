import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importation des classes nécessaires
import { Topic } from '../models/topic';
import { TopicService } from '../services/topic.service';
import {
  IonModal,
  IonButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonCard,
  IonCardContent,
  IonRadioGroup,
  IonRadio,
  IonInput,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, trashOutline } from 'ionicons/icons';
import { NgIf } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-reader-writer-modal',
  templateUrl: './edit-reader-writer-modal.component.html',
  styleUrls: ['./edit-reader-writer-modal.component.scss'],
  imports: [
    IonInput,
    IonRadio,
    IonRadioGroup,
    IonCardContent,
    IonCard,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButton,
    IonButtons,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    TranslateModule,
    NgIf,
    FormsModule,
  ],
})
export class EditReaderWriterModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() topicId: string = '';
  @Output() closeEmitter = new EventEmitter<void>();

  protected users: { email: string; role: 'reader' | 'writer' }[] = [];
  protected topic: Topic = {} as Topic;
  private topicService: TopicService = inject(TopicService);
  translate = inject(TranslateService);
  private toastController = inject(ToastController);

  public isAddingUser: boolean = false;
  public newUserEmail: string = '';
  public newUserRole: 'reader' | 'writer' = 'reader';

  ngOnInit() {
    this.isAddingUser = false;
    this.loadTopic();
  }

  constructor() {
    addIcons({ trashOutline, add });
  }

  private loadTopic(): void {
    this.topicService.get(this.topicId).subscribe((topic) => {
      if (topic) {
        this.topic = topic;

        const combinedUsers = [
          ...topic.readers.map((email) => ({ email, role: 'reader' as const })),
          ...topic.editors.map((email) => ({ email, role: 'writer' as const })),
        ];

        const uniqueUsersMap = new Map<string, { email: string; role: 'reader' | 'writer' }>();

        combinedUsers.forEach((user) => {
          if (uniqueUsersMap.has(user.email)) {
            const existingUser = uniqueUsersMap.get(user.email);
            if (existingUser) {
              existingUser.role = user.role;
            }
          } else {
            uniqueUsersMap.set(user.email, user);
          }
        });

        this.users = Array.from(uniqueUsersMap.values());
      }
    });
  }

  closeModal(): void {
    this.isAddingUser = false;
    this.closeEmitter.emit();
  }

  updateRole(user: { email: string; role: 'reader' | 'writer' }, role?: 'reader' | 'writer'): void {
    const newRole = role || user.role;
    if (user.role != newRole) {
      this.topicService.switchUserRole(this.topic, user.email);
      this.loadTopic();
    }
  }

  removeUser(user: { email: string; role: 'reader' | 'writer' }) {
    this.topicService.removeUserFromRoles(this.topic, user.email);
    this.users = this.users.filter((u) => u.email !== user.email);
  }

  showAddUserForm() {
    this.isAddingUser = true;
  }

  async addUser() {
    if (this.topic.readers.includes(this.newUserEmail)) {
      const translatedMessage = await firstValueFrom(this.translate.get('USER_ALREADY_READER'));
      const toast = await this.toastController.create({
        message: translatedMessage,
        duration: 1500,
        position: 'bottom',
      });
      await toast.present();
    } else if (this.topic.editors.includes(this.newUserEmail)) {
      const translatedMessage = await firstValueFrom(this.translate.get('USER_ALREADY_WRITER'));
      const toast = await this.toastController.create({
        message: translatedMessage,
        duration: 1500,
        position: 'bottom',
      });
      await toast.present();
    } else if (this.newUserEmail && this.newUserRole) {
      this.topicService.addUserToTopic(this.topic, this.newUserEmail, this.newUserRole);
      this.isAddingUser = false;
      this.newUserEmail = '';
      this.newUserRole = 'reader';
      this.loadTopic();
    }
  }

  cancelAddUser(): void {
    this.isAddingUser = false;
    this.newUserEmail = '';
    this.newUserRole = 'reader';
  }
}
