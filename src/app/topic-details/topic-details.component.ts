import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss'],
})
export class TopicDetailsComponent  implements OnInit {

  constructor(private route: ActivatedRoute) { }

  topicId: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
         this.topicId = params.get('id');
    });
  }

}
