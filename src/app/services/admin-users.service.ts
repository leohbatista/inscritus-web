import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  constructor(
    private angularFirestore: AngularFirestore
  ) { }

  getUserByUID(uid: string): Observable<User> {
    return this.angularFirestore.doc(`users/${uid}`).valueChanges();
  }

  searchUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('users').get().toPromise().then(snapshot => {
        if(snapshot.empty) {
          resolve([]);
        } else {
          resolve(snapshot.docs.map(doc => doc.data()));
        }
      }).catch()
    });
  }
}
