import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { firestore } from 'firebase';
import { Speaker } from 'functions/src/speakers/speaker.model';

@Injectable({
  providedIn: 'root'
})
export class SpeakersService {

  constructor(
    private angularFirestore: AngularFirestore,
  ) { }

  createSpeaker(speaker: Speaker): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = firestore.Timestamp.now();

      const id = this.angularFirestore.createId();
      this.angularFirestore.collection('speakers').doc(id).set({
        ...speaker,
        id,
      }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  deleteSpeaker(speakerId): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('speakers').doc(speakerId).delete().then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  editSpeaker(speakerId: string, data: Speaker) {
    return new Promise((resolve, reject) => {
      const now = firestore.Timestamp.now();

      this.angularFirestore.collection('speakers').doc(speakerId).set({
        ...data,
        lastUpdate: now,
      }, { merge: true }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  getSpeaker(id: string): Observable<Speaker> {
    return this.angularFirestore.collection('speakers').doc(id).valueChanges();
  }

  getSpeakers(): Observable<Speaker[]> {
    return this.angularFirestore.collection('speakers').valueChanges();
  }
}
