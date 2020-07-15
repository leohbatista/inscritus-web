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

  getLocations(): Observable<Location[]> {
    return this.angularFirestore.collection('locations').valueChanges();
  }

  getLocation(id: string): Observable<Location> {
    return this.angularFirestore.collection('locations').doc(id).valueChanges();
  }
}
