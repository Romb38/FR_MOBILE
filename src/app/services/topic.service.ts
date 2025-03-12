import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Topic, Topics } from '../models/topic';
import { Post, Posts } from '../models/post';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, map, take } from 'rxjs';
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

  getAll(): Observable<Topics> {
    const topicsCollection = collection(this.firestore, 'topics');
    return collectionData(topicsCollection, {idField: 'id'}) as Observable<Topics>;
  }

  get(topicId: string): Observable<Topic | undefined> {
    const topicDoc = doc(this.firestore, `topics/${topicId}`);
    return docData(topicDoc, {idField: 'id'}) as Observable<Topic>;
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

  getAllPost(topicId : String): Observable<Posts> {
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
    let updatedTopic = {...topic};
    updatedTopic.readers.push(email)
    const topicDoc = doc(this.firestore, `topics/${updatedTopic.id}`);
    setDoc(topicDoc, updatedTopic, { merge: true });
  }

  addTopicWriter(topic: Topic, email:string): void {
    let updatedTopic = {...topic};
    updatedTopic.editors.push(email)
    const topicDoc = doc(this.firestore, `topics/${updatedTopic.id}`);
    setDoc(topicDoc, updatedTopic, { merge: true });
  }

  canReadTopic(topic: Topic) : Observable<boolean> {
    return this.authService.getUserEmail().pipe(
      map((email) =>{
          if(email == topic.author || email in topic.readers || email in topic.editors){
            return true
          }
          return false
      })
    )
  }

  canWriteTopic(topic: Topic) : Observable<boolean> {
    return this.authService.getUserEmail().pipe(
      map((email) =>{
          if(email == topic.author || email in topic.editors){
            return true
          }
          return false
      })
    )
  }

}
