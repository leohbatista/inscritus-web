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

  createActivity(activity: Activity, /* speakers?: Speaker[] */) {
    return new Promise((resolve, reject) => {
      const activityId = this.angularFirestore.createId();
      this.angularFirestore.collection('activities').doc(activityId).set({
        ...activity,
        aid: activityId,
      }, { merge: true }).then(() => {
        console.error("Activity was saved"); 
        resolve();
      }).catch(err => {
        console.error("Error saving activity", err); 
        reject(err);
      })
    })
  }

  getActivityTypes(): Observable<ActivityType[]> {
    return this.angularFirestore.collection('activity-types').valueChanges();
  }
}
