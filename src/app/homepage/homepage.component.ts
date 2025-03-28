import { Component, inject } from '@angular/core';
import { TopBarComponent } from "../top-bar/top-bar.component";
import { TopicService } from '../services/topic.service';
import { IonItem, IonLabel, IonList, IonContent, IonButton, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { ModalCreationComponent } from "../modal-creation/modal-creation.component";
import { Router } from '@angular/router';
import { Topic, Topics } from '../models/topic';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  imports: [IonRefresherContent, IonRefresher, 
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
    TopBarComponent
],
})
export class HomepageComponent {
  isModalVisible: boolean = false;

  private router: Router = inject(Router);
  protected topicService = inject(TopicService);
  protected auth : AuthService = inject(AuthService)
  topics: Observable<Topics> = this.topicService.getAll();

  handleRefresh(event: any) {
    console.debug("Page rafraîchie !");
    window.location.reload();
  
    setTimeout(() => {
      event.target.complete();
    }, 1000);
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

  deleteItem(topic : Topic): void {
    this.topicService.removeTopic(topic)
  }

  logout(){
    this.auth.logOutConnectedUser()
    this.router.navigate(["login"]).then(() => {
      window.location.reload();
    });
  }
}
