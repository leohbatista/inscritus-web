import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityType, Activity, ActivityRegistration, ActivityAttendance } from 'functions/src/activities/activity.model';
import { firestore } from 'firebase';

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
        console.error('Activity was saved');
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
        console.error('Activity was saved');
        resolve();
      }).catch(err => {
        console.error('Error saving activity', err);
        reject(err);
      });
    });
  }

  getActivity(id: string): Observable<ActivityType> {
    return this.angularFirestore.collection('activities').doc(id).valueChanges();
  }

  getActivities(): Observable<ActivityType[]> {
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
  createAttendant(attendance: ActivityAttendance): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('activities').doc(attendance.activity).collection('attendants').doc(attendance.user).set(
        attendance
      ).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  deleteAttendant(attendance: ActivityAttendance): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('activities').doc(attendance.activity).collection('attendants')
      .doc(attendance.user).delete().then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  getAttendants(activityId: string): Observable<ActivityAttendance[]> {
    return this.angularFirestore.collection('activity-types').doc(activityId).collection('attendants').valueChanges();
  }

  // Registered
  createRegistration(registration: ActivityRegistration): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('activities').doc(registration.activity).collection('registrations').doc(registration.user).set(
        registration
      ).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  deleteRegistration(registration: ActivityRegistration): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('activities').doc(registration.activity).collection('registrations')
      .doc(registration.user).delete().then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  getRegistered(activityId: string): Observable<ActivityRegistration[]> {
    return this.angularFirestore.collection('activity-types').doc(activityId).collection('registrations').valueChanges();
  }
}
