import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UsersResult, User, FavoriteActivity } from 'functions/src/users/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  constructor(
    private angularFirestore: AngularFirestore,
    private authService: AuthService,
    private http: HttpClient
  ) { }


  addFavoriteActivity(user: string, activity: string) {
    return new Promise((resolve, reject) => {
      const now = new Date();
      this.angularFirestore.collection('users').doc(user).collection('favorites').doc(activity).set({
        activity,
        createdAt: firestore.Timestamp.now()
      }, { merge: true }).then(() => {
        console.log('Activity was favorited');
        resolve();
      }).catch(err => {
        console.error('Error saving favorite', err);
        reject(err);
      });
    });
  }

  editUser(userData: User): Promise<void> {
    return new Promise((resolve, reject) => {
      const user = {
        ...userData,
        lastUpdate: firestore.Timestamp.now(),
      };

      const userRef = this.angularFirestore.collection<User>('users').doc(user.uid);

      userRef.set(user, { merge: true }).then(() => {
        resolve()
      }).catch(err => {
        console.log('Error saving user');
        reject(err);
      })
    })
  }

  getFavoriteActivities(uid: string): Observable<FavoriteActivity[]> {
    return this.angularFirestore.doc(`users/${uid}`).collection('favorites').valueChanges();
  }

  getUserByUID(uid: string): Observable<User> {
    return this.angularFirestore.doc(`users/${uid}`).valueChanges();
  }

  removeFavoriteActivity(user: string, activity: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('users').doc(user).collection('favorites').doc(activity).delete().then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  searchUsers({
    filterField,
    filterValue,
    orderField = 'name',
    orderDirection = 'desc',
    pageSize = 10,
    page = 0,
  }: {
    filterField?: string;
    filterValue?: string;
    orderField?: string;
    orderDirection?: string;
    pageSize?: number;
    page: number;
  }): Promise<UsersResult>  {
    console.log(filterField, filterValue, );
    return new Promise((resolve, reject) => {
      const params = `filterField=${filterField}&filterValue=${filterValue}&orderField=${orderField}&orderDirection=${orderDirection}&page=${page}&pageSize=${pageSize}`

      this.http.get(
        `${environment.functionsUrl}/users/search?${params}`,
        { responseType: 'json', headers: this.authService.getHeaders() }
      ).toPromise().then(res => {
        resolve(res as UsersResult);
      }).catch(err => {
        console.error('Error getting users.', err);
        reject(err);
      });
    });
  }
}
