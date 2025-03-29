import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, query, setDoc, where } from '@angular/fire/firestore';
import { Topic, Topics } from '../models/topic';
import { Post, Posts } from '../models/post';
import { Observable } from 'rxjs/internal/Observable';
import {BehaviorSubject, combineLatest, map, of, switchMap, take, throwError} from 'rxjs';
import { generateUID } from '../utils/uuid';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private topicsSubject$: BehaviorSubject<Topics> = new BehaviorSubject<Topics>([]);
  public topics$: Observable<Topics> = this.topicsSubject$.asObservable(); // Exposes a safe, read-only observable to other components/services.

  private firestore: Firestore = inject(Firestore);
  private authService : AuthService = inject(AuthService);


  constructor() {}

  getAll(): Observable<Topic[]> {
    return combineLatest([
      this.getTopicsByAuthor(),
      this.getTopicsByReader(),
      this.getTopicsByWriter()
    ]).pipe(
      map(([authors, readers, writers]) => {
        const allTopics = [
          ...authors,
          ...readers,
          ...writers
        ];

        // Ensure allTopics array contains unique topics
        // Adds each topic to the unique array only if it is not already present
        const uniqueTopics = allTopics.reduce((unique: Topic[], topic) => {
          if (!unique.some(t => t.id === topic.id)) {
            unique.push(topic);
          }
          return unique;
        }, []);

        // Update topicsSubject$ and send the info to any subscribers listening for this up-to-date topics list
        this.topicsSubject$.next(uniqueTopics);
        return uniqueTopics;
      })
    );
  }

  getTopicsByAuthor(): Observable<Topic[]> {
    return this.authService.getConnectedUser().pipe(
      switchMap((user) => {
        const topicsRef = collection(this.firestore, 'topics'); // 'topics' est le nom de ta collection
        const q = query(topicsRef, where('author', '==', user?.email));

        return collectionData(q, { idField: 'id' }) as Observable<Topic[]>;
      }),
      map((topics) => {
        return topics.map((topic) => ({
          ...topic,
          isOwner: true,
          isWriter:true,
          isReader:true
        }));
      })
    )
  }


  getTopicsByReader(): Observable<Topic[]> {
    return this.authService.getConnectedUser().pipe(
      switchMap((user) => {
        const topicsRef = collection(this.firestore, 'topics'); // 'topics' est le nom de ta collection
        const q = query(topicsRef, where('readers', 'array-contains', user?.email));

        return collectionData(q, { idField: 'id' }) as Observable<Topic[]>;
      }),
      map((topics) => {
        return topics.map((topic) => ({
          ...topic,
          isReader: true,
        }));
      })
    )
  }

  getTopicsByWriter(): Observable<Topic[]> {
    return this.authService.getConnectedUser().pipe(
      switchMap((user) => {
        const topicsRef = collection(this.firestore, 'topics');
        const q = query(topicsRef, where('editors', 'array-contains', user?.email));

        return (collectionData(q, { idField: 'id' }) as Observable<Topic[]>)
      }),
      map((topics) => {
        return topics.map((topic) => ({
          ...topic,
          isWriter: true,
          isReader: true
        }));
      })
    )
  }

  get(topicId: string): Observable<Topic | undefined> {
    return this.topics$.pipe(
      map((topics) => {
        return topics.find(topic => topic.id === topicId);
      })
    );
  }

  addTopic(topic: Topic): void {
    this.authService.getUserEmail().pipe(
      map((email) => {
        if (email){
          topic.author = email
        } else {
          return
        }

        if (!topic?.name.length) return;
        topic.id = generateUID();

        const topicsCollection = collection(this.firestore, 'topics');
        addDoc(topicsCollection, topic)
      })
    ).subscribe()
  }

  removeTopic(topic: Topic): void {
    const topicDoc = doc(this.firestore, `topics/${topic.id}`);
    deleteDoc(topicDoc)
  }

  updateTopic(updatedTopic: Topic): void {
    const topicDoc = doc(this.firestore, `topics/${updatedTopic.id}`);
    setDoc(topicDoc, updatedTopic, { merge: true });
  }

  getAllPosts(topicId : String): Observable<Posts> {
    if (!topicId) {
      console.error('Invalid topicId:', topicId);
      return new Observable();
    }
    const postsCollection = collection(this.firestore, `topics/${topicId}/posts`);
    return collectionData(postsCollection, {idField: 'id'}) as Observable<Posts>;
  }

  getPost(topicId: string, postId: string): Observable<Post | undefined> {
    const postDoc = doc(this.firestore, `topics/${topicId}/posts/${postId}`);
    return docData(postDoc, {idField: 'id'}) as Observable<Post>;
  }

  addPost(post: Post, topicId: string): void {
    post.id = generateUID();
    const postsCollection = collection(this.firestore, `topics/${topicId}/posts`);
    addDoc(postsCollection, post)
  }

  removePost(postId: string, topicId: string): void {
    const postDoc = doc(this.firestore, `topics/${topicId}/posts/${postId}`);
    deleteDoc(postDoc)
  }

  editPost(updatedPost: Post, topicId: string): void {
    const postDoc = doc(this.firestore, `topics/${topicId}/posts/${updatedPost.id}`);
    setDoc(postDoc, updatedPost, { merge: true });
  }

  addTopicReader(topic: Topic, email:string): void{
    const {isOwner, isWriter, isReader, ...updatedTopic} = topic;
    updatedTopic.readers.push(email)
    const topicDoc = doc(this.firestore, `topics/${updatedTopic.id}`);
    setDoc(topicDoc, updatedTopic, { merge: true });
  }

  addTopicWriter(topic: Topic, email:string): void {
    const {isOwner, isWriter, isReader, ...updatedTopic} = topic;
    updatedTopic.editors.push(email)
    const topicDoc = doc(this.firestore, `topics/${updatedTopic.id}`);
    setDoc(topicDoc, updatedTopic, { merge: true });
  }

  removeTopicReader(topic: Topic, old_email:string): void{
    const {isOwner, isWriter, isReader, ...updatedTopic} = topic;
    updatedTopic.readers = updatedTopic.readers.filter(email => email != old_email)
    const topicDoc = doc(this.firestore, `topics/${updatedTopic.id}`);
    setDoc(topicDoc, updatedTopic, { merge: true });
  }

  removeTopicWriter(topic: Topic, old_email:string): void {
    const {isOwner, isWriter, isReader, ...updatedTopic} = topic;
    updatedTopic.editors = updatedTopic.editors.filter(email => email != old_email)
    const topicDoc = doc(this.firestore, `topics/${updatedTopic.id}`);
    setDoc(topicDoc, updatedTopic, { merge: true });
  }

}
