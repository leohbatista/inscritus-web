import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { firestore } from 'firebase';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { User } from 'functions/src/users/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;
  idTokenUser: Observable<string>;
  userSessionToken: string = '';

  constructor(
    public angularFireAuth: AngularFireAuth,
    public angularFirestore: AngularFirestore,
    private router: Router,
  ) {
    this.configObservables();
  }

  configObservables() {
    this.idTokenUser = this.angularFireAuth.idToken;

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

        const user = {
          ...userData,
          uid: auth.user.uid,
          emailVerified: auth.user.emailVerified,
          createdAt: firestore.Timestamp.now(),
          lastUpdate: firestore.Timestamp.now(),
          isActive: true,
        }

        const userRef = this.angularFirestore.collection<User>('users').doc(auth.user.uid);

        userRef.set(user).then(() => {
          console.log('User successfully created');
          this.angularFireAuth.signInWithEmailAndPassword(userData.email, password).then(credential => {
            this.sendVerificationEmail(auth);
            this.user = userRef.valueChanges() as Observable<User>;
            resolve();
          }).catch(err => {
            console.error('Error login in the user', err);

          });

        }).catch(err => {
          console.log('Error creating user');
          reject(err);
        })
      })
    });
  }

  getHeaders() {
    return {
      Authorization: 'Bearer ' + this.userSessionToken,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
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
        if (err.code === 'auth') {
          console.error('Error on login');
        }

        reject(err);
      });
    });
  }

  private updateUserWithAuth({ user }) {
    const data: User = {
      emailVerified: user.emailVerified,
      lastUpdate: firestore.Timestamp.now(),
      uid: user.uid,
    };

    if(user.email) {
      data.email = user.email.trim().toLowerCase();
    }

    const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(`users/${user.uid}`);

    return userRef.set(data, { merge: true }).then(() => {
      console.log('Updated User');
    }).catch(e => {
      console.error('Error updating user', e);
    });
  }

  sendVerificationEmail(auth: firebase.auth.UserCredential): void {
    auth.user.sendEmailVerification({ url: `${environment.baseURL}/atividades` });
  }

  redirectUser(currentPath: string, redirectToPathLogged = '/avisos', redirectToPathUnlogged = '/entrar') {

    if (currentPath.indexOf('/verificar') === 0) {
      currentPath = '/verificar';
    }
    console.log(currentPath, redirectToPathLogged, redirectToPathUnlogged);

    return new Promise(resolve => {
      this.user.pipe(take(1)).subscribe(user => {
        if(user !== null && user.uid) {
          if(user.isActive) {
            switch (currentPath) {
              case '/':
              case '/cadastro':
              case '/entrar':
                this.router.navigate([redirectToPathLogged]);
                break;
              default:
                break;
            }
          } else {
            this.router.navigate(['/minha-conta']);
          }
        } else {
          switch (currentPath) {
            case '/':
            case '/cadastro':
            case '/entrar':
            case '/verificar':
              break;
            default:
              this.router.navigate([redirectToPathUnlogged]);
              break;
          }
        }
        resolve();
      });
    });
  }

  confirmEmail(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.applyActionCode(code).then(async () => {
        const currentUser = await this.angularFireAuth.currentUser;
        this.updateUserWithAuth({
          user: currentUser
        });
        resolve();
      }).catch(err => reject(err));
    });
  }

  confirmResetCode(actionCode: string) {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.verifyPasswordResetCode(actionCode).then(email => {
        resolve(email);
      }).catch(err => {
        console.log('Error validating reset password code', err);
        reject(err);
      });
    });
  }

  resendVerificationEmail() {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.currentUser.then(user => {
        user.sendEmailVerification().then(() => resolve()).catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }

  editUser(userData: User): Promise<void> {
    return new Promise((resolve, reject) => {
      const user = {
        ...userData,
        lastUpdate: firestore.Timestamp.now(),
      }

      const userRef = this.angularFirestore.collection<User>('users').doc(user.uid);

      userRef.set(user, { merge: true }).then(() => {
        resolve();
      }).catch(err => {
        console.log('Error saving user');
        reject(err);
      });
    });
  }

  resetPassword(actionCode, newPassword, userEmail): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.verifyPasswordResetCode(actionCode).then(email => {
        if (userEmail === email) {
          this.angularFireAuth.confirmPasswordReset(actionCode, newPassword).then(() => {
            console.log('Password reset has been confirmed and new password updated');
            resolve();
          }).catch(err => {
            console.error('Error redefining the password', err);
            reject(err);
          });
        } else {
          console.error('Error redefining the password');
          reject(new Error('E-mails mismatch'));
        }
      }).catch(err => {
        console.error('Error validating code', err);
        reject(err);
      });
    });
  }

  sendPasswordResetEmail(userEmail: string) {
    return new Promise((resolve, reject) => {
      const auth = this.angularFireAuth.sendPasswordResetEmail(userEmail).then(() => {
        console.log('Reset password e-mail was sent');
        resolve();
      }).catch(err => {
        console.log('Error sending reset password e-mail', err);
        reject(err);
      });
    });
  }
}

