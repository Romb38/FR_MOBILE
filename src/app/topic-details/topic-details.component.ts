import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss'],
  imports: [IonItem, IonLabel, IonList],
})
export class TopicDetailsComponent  implements OnInit {

  constructor() { }

  private route: ActivatedRoute = inject(ActivatedRoute)
  private topicService : TopicService = inject(TopicService)
  topicId: string = "";
  topic: Topic = {} as Topic

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
         this.topicId = params.get('id') ?? "";
         this.topic = this.topicService.get(this.topicId)

    });
  }

}
