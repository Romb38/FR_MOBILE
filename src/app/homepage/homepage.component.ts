import { Component, OnInit } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  imports: [IonItem, IonLabel, IonList, NgFor],
})
export class HomepageComponent  implements OnInit {
  constructor(protected topicService: TopicService) {}

  ngOnInit() {
    this.topicService.addTopic({
      id: 't1',
      name: 'This is my first topic',
      posts: [
        {id: 'p1', name: 'Post #1', description: 'This is a description'},
        {id: 'p2', name: 'Post #2', description: 'This is a description'},
      ]
    });
  }

}
