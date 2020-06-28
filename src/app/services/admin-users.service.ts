import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UsersResult, User } from 'functions/src/users/user.model';
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


  editUser(userData: User): Promise<void> {
    return new Promise((resolve, reject) => { 
      let user = {
        ...userData,
        lastUpdate: firestore.Timestamp.now(),
      }

      const userRef = this.angularFirestore.collection<User>('users').doc(user.uid);
      
      userRef.set(user, { merge: true }).then(() => {
        resolve()
      }).catch(err => {
        console.log('Error saving user');
        reject(err);
      })
    })
  }

  getUserByUID(uid: string): Observable<User> {
    return this.angularFirestore.doc(`users/${uid}`).valueChanges();
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
    })
  }
}
