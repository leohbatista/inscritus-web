import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { Post } from 'functions/src/feed/feed.model';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(
    private angularFirestore: AngularFirestore,
  ) { }

  createPost(post: Post): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = firestore.Timestamp.now();

      this.angularFirestore.collection('feed').doc(now.toDate().toISOString()).set({
        ...post,
        postedAt: now,
        lastUpdate: now,
        id: now.toDate().toISOString(),
      }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  deletePost(postId): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('feed').doc(postId).delete().then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  editPost(postId: string, data: Post) {
    return new Promise((resolve, reject) => {
      const now = firestore.Timestamp.now();

      this.angularFirestore.collection('feed').doc(postId).set({
        ...data,
        lastUpdate: now,
      }, { merge: true }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  getPosts(): Observable<Post[]> {
    return this.angularFirestore.collection('feed').valueChanges();
  }
}
