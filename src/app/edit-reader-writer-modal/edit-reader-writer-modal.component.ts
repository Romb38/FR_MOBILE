import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Topic } from '../models/topic';
import { TopicService } from '../services/topic.service';
import { IonModal, IonButton, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonCard, IonCardContent, IonRadioGroup, IonRadio } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-edit-reader-writer-modal',
  templateUrl: './edit-reader-writer-modal.component.html',
  styleUrls: ['./edit-reader-writer-modal.component.scss'],
  imports: [IonRadio, IonRadioGroup, IonCardContent, IonCard, IonModal, IonHeader, IonToolbar, IonButton, IonButtons, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, TranslateModule]
})
export class EditReaderWriterModalComponent implements OnInit {

  @Input() isVisible: boolean = false;
  @Input() topicId: string = "";
  @Output() close = new EventEmitter<void>();

  protected users: { email: string, role: 'reader' | 'writer' }[] = [];
  protected topic: Topic = {} as Topic;
  private topicService: TopicService = inject(TopicService);

  ngOnInit() {
    this.loadTopic();
  }

  constructor(){
    addIcons({trashOutline})
  }

  private loadTopic(): void {
    this.topicService.get(this.topicId).subscribe((topic) => {
      if (topic) {
        this.topic = topic;
  
        // Combine les lecteurs et les rédacteurs, mais sans doublons d'email
        const combinedUsers = [
          ...topic.readers.map(email => ({ email, role: 'reader' as const })),
          ...topic.editors.map(email => ({ email, role: 'writer' as const }))
        ];
  
        // Crée un objet Map pour garantir que chaque email est unique
        const uniqueUsersMap = new Map<string, { email: string, role: 'reader' | 'writer' }>();
  
        combinedUsers.forEach(user => {
          // Si l'email existe déjà, on met à jour le rôle (en fonction de la priorité de 'writer' ou 'reader')
          if (uniqueUsersMap.has(user.email)) {
            const existingUser = uniqueUsersMap.get(user.email);
            if (existingUser) {
              // Si l'email existe déjà, on met à jour le rôle en fonction de la logique
              // On préfère ici le rôle 'writer' s'il existe dans les éditeurs, sinon 'reader'
              existingUser.role = user.role;
            }
          } else {
            // Sinon, on l'ajoute à la liste
            uniqueUsersMap.set(user.email, user);
          }
        });
  
        // Convertit le Map en tableau pour obtenir la liste unique des utilisateurs
        this.users = Array.from(uniqueUsersMap.values());
      }
    });
  }
  

  closeModal(): void {
    this.close.emit();
  }

  updateRole(user: { email: string, role: 'reader' | 'writer' }, role?: 'reader' | 'writer'): void {
    const newRole = role || user.role;
    if (user.role != newRole){
      console.log(user)
      this.topicService.switchUserRole(this.topic, user.email);
      this.loadTopic();
    }
    
  }

  removeUser(user: { email: string, role: 'reader' | 'writer' }) {
    this.topicService.removeUserFromRoles(this.topic,user.email)
    this.users = this.users.filter(u => u.email !== user.email); // Mise à jour locale immédiate
  }
}
