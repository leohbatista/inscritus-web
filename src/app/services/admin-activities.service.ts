import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityType, Activity, ActivityRegistration, ActivityAttendance } from 'functions/src/activities/activity.model';
import { firestore } from 'firebase';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AdminActivitiesService {

  constructor(
    private angularFirestore: AngularFirestore,
    private http: HttpClient
  ) { }

  // Activities
  createActivity(activity: Activity) {
    return new Promise((resolve, reject) => {
      const activityId = this.angularFirestore.createId();
      this.angularFirestore.collection('activities').doc(activityId).set({
        ...activity,
        id: activityId,
        lastUpdate: firestore.Timestamp.now()
      }, { merge: true }).then(() => {
        console.log('Activity was saved');
        resolve();
      }).catch(err => {
        console.error('Error saving activity', err);
        reject(err);
      });
    });
  }

  editActivity(activity: Activity) {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('activities').doc(activity.id).set({
        ...activity,
        lastUpdate: firestore.Timestamp.now()
      }, { merge: true }).then(() => {
        console.log('Activity was saved');
        resolve();
      }).catch(err => {
        console.error('Error saving activity', err);
        reject(err);
      });
    });
  }

  getActivity(id: string): Observable<Activity> {
    return this.angularFirestore.collection('activities').doc(id).valueChanges();
  }

  getActivities(): Observable<Activity[]> {
    return this.angularFirestore.collection('activities').valueChanges();
  }

  // Activity Types
  createActivityType(type: ActivityType): Promise<void> {
    return new Promise((resolve, reject) => {
      const activityTypeId = this.angularFirestore.createId();

      this.angularFirestore.collection('activity-types').doc(activityTypeId).set({
        ...type,
        id: activityTypeId,
      }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  deleteActivityType(typeId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('activity-types').doc(typeId).delete().then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  editActivityType(typeId: string, data: ActivityType) {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('activity-types').doc(typeId).set(data, { merge: true }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  getActivityType(id: string): Observable<ActivityType> {
    return this.angularFirestore.collection('activity-types').doc(id).valueChanges();
  }

  getActivityTypes(): Observable<ActivityType[]> {
    return this.angularFirestore.collection('activity-types').valueChanges();
  }

  // Attendances
  createAttendant(activity: string, attendance: ActivityAttendance): Promise<void> {
    const attBase = {
      ...attendance,
      registeredAt: firestore.Timestamp.now(),
      activity,
    };
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('activities').doc(activity).collection('attendants').doc(attendance.user).set(
        _.omit(attBase, ['activity']),
      ).then(() => {
        this.angularFirestore.collection('users').doc(attendance.user).collection('attendances').doc(activity).set(
          _.omit(attBase, ['user'])
        ).then(() => {
          resolve();
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  deleteAttendant(activity: string, user: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('users').doc(user).collection('attendances').doc(activity).delete().then(() => {
        this.angularFirestore.collection('activities').doc(activity).collection('attendants').doc(user).delete().then(() => {
          resolve();
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  getAttendants(activity: string): Observable<ActivityAttendance[]> {
    return this.angularFirestore.collection('activities').doc(activity).collection('attendants').valueChanges();
  }

  // Attendances
  createRegistration(activity: string, registration: ActivityRegistration): Promise<void> {
    const regBase = {
      ...registration,
      registeredAt: firestore.Timestamp.now(),
      activity,
    };
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('activities').doc(activity).collection('registrations').doc(registration.user).set(
        _.omit(regBase, ['activity']),
      ).then(() => {
        this.angularFirestore.collection('users').doc(registration.user).collection('registrations').doc(activity).set(
          _.omit(regBase, ['user'])
        ).then(() => {
          resolve();
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  deleteRegistration(activity: string, user: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('users').doc(user).collection('registrations').doc(activity).delete().then(() => {
        this.angularFirestore.collection('activities').doc(activity).collection('registrations').doc(user).delete().then(() => {
          resolve();
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  getRegistrations(activity: string): Observable<ActivityRegistration[]> {
    return this.angularFirestore.collection('activities').doc(activity).collection('registrations').valueChanges();
  }
}
