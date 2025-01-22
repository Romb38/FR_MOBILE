import { Injectable } from '@angular/core';
import { Topic, Topics } from '../models/topic';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  topics: Topics = [];
  constructor() { }

  getAll(): Topics {
    return this.topics
  };

  get(topicId: string): Topic {
    return this.topics.find((t) => {
      t.id == topicId
    }) as Topic
  };

  addTopic(topic: Topic): void {
    this.topics.push(topic)
  };

  addPost(post: Post, topicId: string): void {
    let topic : Topic | undefined = this.topics.find((t) => {
      t.id == topicId
    })

    if (!topic){
      return
    }
    
    topic.posts.push(post)
  };
}
