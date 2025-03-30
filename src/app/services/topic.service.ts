import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { Topic, Topics } from '../models/topic';
import { Post, Posts } from '../models/post';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { generateUID } from '../utils/uuid';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private topicsSubject$: BehaviorSubject<Topics> = new BehaviorSubject<Topics>([]);
  public topics$: Observable<Topics> = this.topicsSubject$.asObservable(); // Exposes a safe, read-only observable to other components/services.

  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  constructor() {}

  getAll(): Observable<Topic[]> {
    return combineLatest([
      this.getTopicsByAuthor(),
      this.getTopicsByReader(),
      this.getTopicsByWriter(),
    ]).pipe(
      map(([authors, readers, writers]) => {
        const allTopics = [...authors, ...readers, ...writers];

        // Ensure allTopics array contains unique topics
        // Adds each topic to the unique array only if it is not already present
        const uniqueTopics = allTopics.reduce((unique: Topic[], topic) => {
          if (!unique.some((t) => t.id === topic.id)) {
            unique.push(topic);
          }
          return unique;
        }, []);

        // Sort topics with timecreated field in desc order
        const sortedTopics = uniqueTopics.sort((t1, t2) => {
          const timeA: number = t1.timecreated ? new Date(t1.timecreated).getTime() : 0;
          const timeB: number = t2.timecreated ? new Date(t2.timecreated).getTime() : 0;
          return timeB - timeA;
        });

        // Update topicsSubject$ and send the info to any subscribers listening for this up-to-date topics list
        this.topicsSubject$.next(sortedTopics);
        return sortedTopics;
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
          isWriter: true,
          isReader: true,
        }));
      })
    );
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
    );
  }

  getTopicsByWriter(): Observable<Topic[]> {
    return this.authService.getConnectedUser().pipe(
      switchMap((user) => {
        const topicsRef = collection(this.firestore, 'topics');
        const q = query(topicsRef, where('editors', 'array-contains', user?.email));

        return collectionData(q, { idField: 'id' }) as Observable<Topic[]>;
      }),
      map((topics) => {
        return topics.map((topic) => ({
          ...topic,
          isWriter: true,
          isReader: true,
        }));
      })
    );
  }

  get(topicId: string): Observable<Topic | undefined> {
    return this.topics$.pipe(
      map((topics) => {
        return topics.find((topic) => topic.id === topicId);
      })
    );
  }

  addTopic(topic: Topic): void {
    this.authService
      .getUserEmail()
      .pipe(
        map((email) => {
          if (email) {
            topic.author = email;
          } else {
            return;
          }

          if (!topic?.name.length) return;
          topic.id = generateUID();

          const topicsCollection = collection(this.firestore, 'topics');
          addDoc(topicsCollection, topic);
        })
      )
      .subscribe();
  }

  removeTopic(topic: Topic): void {
    const topicDoc = doc(this.firestore, `topics/${topic.id}`);
    deleteDoc(topicDoc);
  }

  updateTopic(updatedTopic: Topic): void {
    const topicDoc = doc(this.firestore, `topics/${updatedTopic.id}`);
    setDoc(topicDoc, updatedTopic, { merge: true });
  }

  getAllPosts(topicId: string): Observable<Posts> {
    if (!topicId) {
      console.error('Invalid topicId:', topicId);
      return new Observable();
    }
    const postsCollection = collection(this.firestore, `topics/${topicId}/posts`);
    const postsQuery = query(postsCollection, orderBy('timecreated', 'asc'));
    return collectionData(postsQuery, { idField: 'id' }) as Observable<Posts>;
  }

  getPost(topicId: string, postId: string): Observable<Post | undefined> {
    const postDoc = doc(this.firestore, `topics/${topicId}/posts/${postId}`);
    return docData(postDoc, { idField: 'id' }) as Observable<Post>;
  }

  addPost(post: Post, topicId: string): void {
    post.id = generateUID();
    const postsCollection = collection(this.firestore, `topics/${topicId}/posts`);
    addDoc(postsCollection, post);
  }

  removePost(postId: string, topicId: string): void {
    const postDoc = doc(this.firestore, `topics/${topicId}/posts/${postId}`);
    deleteDoc(postDoc);
  }

  updatePost(updatedPost: Post, topicId: string): void {
    const postDoc = doc(this.firestore, `topics/${topicId}/posts/${updatedPost.id}`);
    setDoc(postDoc, updatedPost, { merge: true });
  }

  switchUserRole(topic: Topic, email: string): void {
    const isEditor = topic.editors.includes(email);

    if (isEditor) {
      topic.editors = topic.editors.filter((editor) => editor !== email);
      topic.readers.push(email);
    } else {
      topic.readers = topic.readers.filter((reader) => reader !== email);
      topic.editors.push(email);
    }

    const topicDoc = doc(this.firestore, `topics/${topic.id}`);
    setDoc(topicDoc, { readers: topic.readers, editors: topic.editors }, { merge: true })
      .then(() => {
        console.log(`Role switched successfully for ${email}`);
      })
      .catch((error) => {
        console.error('Error switching role: ', error);
      });
  }

  removeUserFromRoles(topic: Topic, email: string): void {
    topic.readers = topic.readers.filter((reader) => reader !== email);
    topic.editors = topic.editors.filter((editor) => editor !== email);

    const topicDoc = doc(this.firestore, `topics/${topic.id}`);
    setDoc(topicDoc, { readers: topic.readers, editors: topic.editors }, { merge: true })
      .then(() => {
        console.log(`User ${email} removed from both roles successfully.`);
      })
      .catch((error) => {
        console.error('Error removing user from roles: ', error);
      });
  }

  addUserToTopic(topic: Topic, email: string, role: 'reader' | 'writer'): void {
    if (role === 'reader') {
      if (!topic.readers.includes(email)) {
        topic.readers.push(email);
      }
    } else if (role === 'writer') {
      if (!topic.editors.includes(email)) {
        topic.editors.push(email);
      }
    }

    const topicDoc = doc(this.firestore, `topics/${topic.id}`);
    setDoc(topicDoc, { readers: topic.readers, editors: topic.editors }, { merge: true })
      .then(() => {
        console.log(`User ${email} added as ${role} to topic ${topic.id}`);
      })
      .catch((error) => {
        console.error('Error adding user to topic: ', error);
      });
  }
}
