import { Injectable } from '@angular/core';
import { Topic } from '../models/topic';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  constructor() { }

  getAll(): Topic[] {
    return []
  };

  get(topicId: string): Topic {
    return {} as Topic
  };

  addTopic(topic: Topic): void {

  };

  addPost(post: Post, topicId: string): void {

    
  };
}
