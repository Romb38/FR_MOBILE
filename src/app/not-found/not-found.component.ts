import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone'
import { TopicService } from '../services/topic.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  imports: [IonContent, IonButton],
})
export class NotFoundComponent  implements OnInit {
  private router: Router = inject(Router)
  
  constructor() { }

  ngOnInit() {}

  goBack() {
    this.router.navigate([''])
  }

}
