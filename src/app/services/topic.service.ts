import { Injectable } from '@angular/core';
import { Topic, Topics } from '../models/topic';
import { Post } from '../models/post';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, map, take } from 'rxjs';
import { generateUID } from '../utils/uuid';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private topicsSubject$: BehaviorSubject<Topics> = new BehaviorSubject<Topics>([]);
  public topics$: Observable<Topics> = this.topicsSubject$.asObservable(); // Exposes a safe, read-only observable to other components/services.

  constructor() {
    this.topicsSubject$.next([
      {
        id: generateUID(),
        name: 'This is my first topic',
        posts: [
          { id: generateUID(), name: 'Post #1', description: 'This is a description' },
          { id: generateUID(), name: 'Post #2', description: 'This is a description' },
        ],
      },
    ]);
  }

  getAll(): Observable<Topics> {
    return this.topics$;
  }

  get(topicId: string): Observable<Topic | undefined> {
    return this.topics$.pipe(map((topics) => topics.find((topic) => topic.id === topicId)));
  }

  addTopic(topic: Topic): void {
    if (!topic?.name.length) return;

    topic.id = generateUID();
    this.topicsSubject$.next([...this.topicsSubject$.value, topic]);
  }

  removeTopic(topic: Topic): void {
    const updatedTopics = this.topicsSubject$.value.filter((t) => t.id !== topic.id);
    this.topicsSubject$.next(updatedTopics);
  }

  addPost(post: Post, topicId: string): void {
    const topicIndex = this.topicsSubject$.value.findIndex((t) => t.id === topicId);
    if (topicIndex === -1) return;

    const topic = structuredClone(this.topicsSubject$.value[topicIndex]); // Clone for immutability.
    post.id = generateUID();
    topic.posts.push(post);
    this.updateTopic(topic);
  }

  removePost(postId: string, topicId: string): void {
    const topicIndex = this.topicsSubject$.value.findIndex((t) => t.id === topicId);
    if (topicIndex === -1) return;

    const topic = structuredClone(this.topicsSubject$.value[topicIndex]); // Clone for immutability.
    topic.posts = topic.posts.filter((post) => post.id !== postId);

    this.updateTopic(topic);
  }

  getPost(topicId: string, postId: string): Observable<Post | undefined> {
    return this.get(topicId).pipe(
      map((topic) => topic?.posts.find((post) => post.id === postId)),
      take(1) // Automatically completes after one emission.
    );
  }

  editPost(updatedPost: Post, topicId: string): void {
    const topicIndex = this.topicsSubject$.value.findIndex((t) => t.id === topicId);
    if (topicIndex === -1) return;

    const topic = structuredClone(this.topicsSubject$.value[topicIndex]);
    const postIndex = topic.posts.findIndex((post) => post.id === updatedPost.id);
    if (postIndex === -1) return;

    topic.posts[postIndex] = updatedPost;
    this.updateTopic(topic);
  }

  private updateTopic(updatedTopic: Topic): void {
    const topics: Topics = this.topicsSubject$.value.map((topic: Topic) =>
      topic.id == updatedTopic.id ? updatedTopic : topic
    );
    this.topicsSubject$.next(topics);
  }
}
