import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Location } from 'functions/src/locations/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  constructor(
    private angularFirestore: AngularFirestore,
  ) { }

  createLocation(location: Location): Promise<void> {
    return new Promise((resolve, reject) => {

      const id = this.angularFirestore.createId();
      this.angularFirestore.collection('locations').doc(id).set({
        ...location,
        id,
      }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  deleteLocation(locationId): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('locations').doc(locationId).delete().then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  editLocation(locationId: string, data: Location) {
    return new Promise((resolve, reject) => {

      this.angularFirestore.collection('locations').doc(locationId).set(data, { merge: true }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  getLocation(id: string): Observable<Location> {
    return this.angularFirestore.collection('locations').doc(id).valueChanges();
  }

  getLocations(): Observable<Location[]> {
    return this.angularFirestore.collection('locations').valueChanges();
  }
}
