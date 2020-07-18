import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityType, Activity } from 'functions/src/activities/activity.model';

@Injectable({
  providedIn: 'root'
})
export class AdminActivitiesService {

  constructor(
    private angularFirestore: AngularFirestore,
    private http: HttpClient
  ) { }

  // Activities
  createActivity(activity: Activity, /* speakers?: Speaker[] */) {
    return new Promise((resolve, reject) => {
      const activityId = this.angularFirestore.createId();
      this.angularFirestore.collection('activities').doc(activityId).set({
        ...activity,
        aid: activityId,
      }, { merge: true }).then(() => {
        console.error('Activity was saved');
        resolve();
      }).catch(err => {
        console.error('Error saving activity', err);
        reject(err);
      })
    })
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

  getActivityTypes(): Observable<ActivityType[]> {
    return this.angularFirestore.collection('activity-types').valueChanges();
  }
}
