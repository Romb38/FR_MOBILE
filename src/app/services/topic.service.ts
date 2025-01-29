import { Injectable } from '@angular/core';
import { Topic, Topics } from '../models/topic';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  topics: Topics = [];
  constructor() { }

  private findTopic(topicId: string): Topic | undefined{
    for (let topic of this.topics){
      if (topic.id == topicId){
        return topic
      }
    }
    return undefined
  }

  getAll(): Topics {
    return this.topics
  };

  get(topicId: string): Topic | undefined {
    return this.findTopic(topicId)
  };

  addTopic(topic: Topic): void {
    if (topic?.name.length) {
      const maxId = this.topics.reduce((max, topic) => Math.max(max, parseInt(topic.id || '0', 10)), 0);
      topic.id = (maxId + 1).toString();
      this.topics.push(topic);
    }
  };


  removeTopic(topic: Topic): void {
    const index = this.topics.findIndex(otherTopic => topic.id === otherTopic.id);
    
    if (index !== -1) {
      this.topics.splice(index, 1);
    }
  }

  addPost(post: Post, topicId: string): void {
    let topic : Topic | undefined = this.findTopic(topicId)

    if (!topic){
      return
    }
    
    topic.posts.push(post)
  };

  removePost(post: Post, topicId: string): void {
    let topic : Topic | undefined = this.findTopic(topicId)

    if (!topic){
      return
    }
    
    const index = topic.posts.findIndex(otherPost => post.id === otherPost.id);
    if (index !== -1) {
      topic.posts.splice(index, 1);
    }
  };

  getPost(topicId : string, postId: string) : Post | undefined {
    let topic : Topic | undefined = this.findTopic(topicId)

    if (!topic){
      return undefined
    }
    
    const index = topic.posts.findIndex(otherPost => postId === otherPost.id);
    return topic.posts[index]
  }

  editPost(post:  Post, topicId : string) : void{
    let topic : Topic | undefined = this.findTopic(topicId)

    if (!topic){
      return
    }
    const index = topic.posts.findIndex(otherPost => post.id === otherPost.id);
    topic.posts[index] = post
  }

}
