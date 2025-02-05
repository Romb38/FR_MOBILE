import { computed, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Topic } from '../models/topic';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  topics: WritableSignal<Topic[]> = signal([]);


  constructor() {
    this.addTopic({
      id: 't1',
      name: 'This is my first topic',
      posts: [
        {id: 'p1', name: 'Post #1', description: 'This is a description'},
        {id: 'p2', name: 'Post #2', description: 'This is a description'},
      ]
    });
  }

  findTopic = computed(() => (topicId: string): Topic | undefined => {
    return this.topics().find(topic => topic.id === topicId);
  });

  getAll(): Signal<Topic[]> {
    return this.topics
  };

  get(topicId: string): Signal<Topic | undefined> {
    return signal(this.findTopic()(topicId))
  };

  addTopic(topic: Topic): void {
    if (topic.name.length) {
      const currentTopics = this.topics.asReadonly()();
      const maxId = currentTopics.reduce((max, t) => Math.max(max, parseInt(t.id || '0', 10)), 0);
      
      topic.id = (maxId + 1).toString();
  
      this.topics.set([...currentTopics, topic]);
    }
  }


  removeTopic(topic: Topic): void {
    const index = this.topics().findIndex(otherTopic => topic.id === otherTopic.id);
    
    if (index !== -1) {
      this.topics().splice(index, 1);
    }
  }

  addPost(post: Post, topicId: string): void {
    let topic : Topic | undefined = this.findTopic()(topicId)

    if (!topic){
      return
    }
    const maxId = topic.posts.reduce((max, post) => Math.max(max, parseInt(post.id || '0', 10)), 0);
    post.id = String(maxId)
    
    topic.posts = [...topic.posts, post]
  };

  removePost(post: Post, topicId: string): void {
    let topic : Topic | undefined = this.findTopic()(topicId)

    if (!topic){
      return
    }
    
    const index = topic.posts.findIndex(otherPost => post.id === otherPost.id);
    if (index !== -1) {
      topic.posts.splice(index, 1);
    }
  };

  getPost(topicId : string, postId: string) : Post | undefined {
    let topic : Topic | undefined = this.findTopic()(topicId)

    if (!topic){
      return undefined
    }
    
    const index = topic.posts.findIndex(otherPost => postId === otherPost.id);
    return topic.posts[index]
  }

  editPost(post:  Post, topicId : string) : void{
    let topic : Topic | undefined = this.findTopic()(topicId)

    if (!topic){
      return
    }
    const index = topic.posts.findIndex(otherPost => post.id === otherPost.id);
    topic.posts[index] = { ...post }
  }

}
