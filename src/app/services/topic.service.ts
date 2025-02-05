import { Injectable } from '@angular/core';
import { Topic, Topics } from '../models/topic';
import { Post } from '../models/post';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, map, take } from 'rxjs';
import { generateUID } from '../utils/uuid';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private topicsSubject: BehaviorSubject<Topics> = new BehaviorSubject<Topics>([]);
  public topics$: Observable<Topics> = this.topicsSubject.asObservable();

  constructor() {
    this.topicsSubject.next([
      {
        id: generateUID(),
        name: 'This is my first topic',
        posts: [
          {id: generateUID(), name: 'Post #1', description: 'This is a description'},
          {id: generateUID(), name: 'Post #2', description: 'This is a description'},
        ]
      }
    ]);
  }

  getAll(): Observable<Topics> {
    return this.topics$;
  };

  get(topicId: string): Observable<Topic | undefined> {
    return this.topics$.pipe(
      map((topics: Topics) => topics.find((topic: Topic) => topic.id === topicId))
    );
  };

  addTopic(topic: Topic): void {
    if (!topic?.name.length) return;

    topic.id = generateUID();
    this.topicsSubject.next([...this.topicsSubject.value, topic]);
  };

  removeTopic(topic: Topic): void {
    const updatedTopics = this.topicsSubject.value.filter(t => t.id !== topic.id);
    this.topicsSubject.next(updatedTopics);
  }

  addPost(post: Post, topicId: string): void {
    const topic: Topic | undefined = this.topicsSubject.value.find(t => t.id === topicId);
    if (typeof topic === undefined) return;
    
    post.id = generateUID();
    topic?.posts.push(post);
  };

  removePost(post: Post, topicId: string): void {
    this.get(topicId).subscribe((topic: Topic | undefined) => {
      if (!topic) return;
      
      const index = topic.posts.findIndex(otherPost => post.id === otherPost.id);
      if (index !== -1) {
        topic.posts.splice(index, 1);
      }
    }).unsubscribe();
  };

  getPost(topicId : string, postId: string): Observable<Post | undefined> {
    return this.get(topicId).pipe(
      map(topic => topic?.posts.find(post => post.id === postId))
    );
  }

  editPost(post: Post, topicId: string): void{
    this.get(topicId).subscribe((topic) => {
      if (!topic) return;

      const index = topic.posts.findIndex(p => p.id === post.id);
      if (index !== -1) {
        topic.posts[index] = post;
        this.updateTopic(topic);
      }
    });
  }

  private updateTopic(updatedTopic: Topic): void {
    const topics = this.topicsSubject.value.map(topic => topic.id === updatedTopic.id ? updatedTopic : topic);
    this.topicsSubject.next(topics);
  }

}
