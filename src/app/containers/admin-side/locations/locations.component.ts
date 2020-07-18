import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import { Location } from 'functions/src/locations/location.model';
import { LocationsService } from 'src/app/services/locations.service';
import { FileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit, OnDestroy {
  readonly faMapMarkerAlt = faMapMarkerAlt;

  readonly defaultLocationImage = '../../assets/img/location-badge.png';

  isLoading = true;

  isCreateMode = false;
  editMode = [];

  locations: Location[];
  locationsSubscription: Subscription;

  newLocation = {
    description: '',
    imageUrl: '',
    mapsLink: '',
    name: '',
  };

  @ViewChild(FileUploadComponent, { static: false }) fileUploader: FileUploadComponent;

  constructor(
    private locationsService: LocationsService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.locationsSubscription = this.locationsService.getLocations().subscribe((locations: Location[]) => {
      this.locations = _.sortBy(locations, ['name']);
      this.editMode = this.locations?.map((s) => ({
        enabled: false,
        data: { ...s },
      })) || [];
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.locationsSubscription) { this.locationsSubscription.unsubscribe(); }
  }

  cancelLocation(): void {
    this.isCreateMode = false;
    this.clearNewLocation();
  }

  createLocation(): void {
    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Confirmar cadastro',
        alertDescription: 'Deseja realmente cadastrar este local?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        const location = {
          ...this.newLocation,
          imageUrl: this.fileUploader.getDocumentUrl()
        };

        this.locationsService.createLocation(location).then(() => {
          this.isCreateMode = false;
          this.clearNewLocation();
          this.snackbar.open('Local cadastrado!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error creating location', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao cadastrar',
              alertDescription: 'Não foi possível cadastrar o local. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  clearNewLocation(): void {
    this.newLocation.name = '';
    this.newLocation.description = '';
    this.newLocation.mapsLink = '';
  }

  deleteLocation(locationId): void {
    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Confirmar exclusão',
        alertDescription: 'Deseja realmente excluir este local?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.locationsService.deleteLocation(locationId).then(() => {
          this.snackbar.open('Local excluído!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error creating location', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao excluir',
              alertDescription: 'Não foi possível excluir o local. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  saveLocation(locationId, i): void {
    console.log(this.editMode[i]);

    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Salvar local',
        alertDescription: 'Deseja realmente salvar as alterações neste local?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.locationsService.editLocation(locationId, {
          ...this.editMode[i].data,
        }).then(() => {
          this.isCreateMode = false;
          this.clearNewLocation();
          this.snackbar.open('Local editado!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error creating location', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao salvar',
              alertDescription: 'Não foi possível editar o local. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  cancelEditLocation(i: number): void {
    this.editMode[i] = {
      enabled: false,
      data: { ...this.locations[i] }
    };
  }

  isNewLocationValid() {
    return this.newLocation.name && this.newLocation.description;
  }

  isEditLocationValid(location) {
    return location.name && location.description;
  }

  editLocationImage(url, i) {
    this.editMode[i].data.imageUrl = url;
  }

  removeImage(i) {
    this.editMode[i].data.imageUrl = '';
  }
}

