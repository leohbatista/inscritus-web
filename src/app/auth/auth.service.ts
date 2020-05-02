import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { User } from '../models/User';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { firestore } from 'firebase';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;

  constructor(
    public angularFireAuth: AngularFireAuth,
    public angularFirestore: AngularFirestore,
  ) {
    this.configObservables();
  }

  configObservables() {
    this.user = this.angularFireAuth.authState.pipe(
      switchMap(user => {
        if(user){
          return this.angularFirestore.doc(`users/${user.uid}`).valueChanges() as Observable<User>;
        } else {
          return of(null as User);
        }
      })
    );
  }

  createUser(userData: User, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.createUserWithEmailAndPassword(userData.email, password).then(auth => {
        console.log(auth, userData);
        
        let user = {
          ...userData,
          uid: auth.user.uid,
          emailVerified: auth.user.emailVerified,
          createdAt: firestore.Timestamp.now(),
          lastUpdate: firestore.Timestamp.now(),
        }

        const userRef = this.angularFirestore.collection<User>('users').doc(auth.user.uid);
        
        userRef.set(user).then(() => {
          console.log('User successfully created');

          this.sendVerificationEmail(auth);

          this.user = userRef.valueChanges() as Observable<User>;
          resolve();
        }).catch(err => {
          console.log('Error creating user');
          reject(err);
        })
      })
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.signOut().then(() => {
        this.configObservables();
        console.log('Logged Out');
        resolve();
      }).catch(err => {
        reject(err);
      });
    })
  }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.signInWithEmailAndPassword(email, password).then(auth => {
        this.updateUserWithAuth(auth);
        resolve();
      }).catch(err => {
        console.error('Error on login');
        
        this.user = of(null as User);
        reject(err);        
      });
    }) 
  }

  private updateUserWithAuth({ user }) {        
    const data: User = {
      email: user.email ? user.email.trim().toLowerCase() : '',
      emailVerified: user.emailVerified,
      lastUpdate: firestore.Timestamp.now(),
      uid: user.uid,
    };
    
    const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(`users/${user.uid}`);

    return userRef.set(data, { merge: true }).then(() => {
      console.log('Updated User');
    }).catch(e => {
      console.error('Error updating user', e);
    });    
  }

  sendVerificationEmail(auth: firebase.auth.UserCredential): void {
    auth.user.sendEmailVerification({ url: `${environment.baseURL}/agents/profile` });
  }
}

