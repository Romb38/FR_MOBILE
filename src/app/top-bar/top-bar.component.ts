import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { TopicService } from '../services/topic.service';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],imports: [
      IonHeader,
      IonToolbar,
      IonTitle,
      IonButton,
      IonButtons,
      IonIcon,
  ],
})
export class TopBarComponent  implements OnInit {

  @Input() title! : String;
  @Input() backRoute : String = ""
  private route: ActivatedRoute = inject(ActivatedRoute)
  private topicService : TopicService = inject(TopicService)
  private router: Router = inject(Router)

  constructor() { }

  ngOnInit() {}

  goTo(){
    this.router.navigate([this.backRoute])
  }
}
