import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { AdminActivitiesService } from 'src/app/services/admin-activities.service';
import { LocationsService } from 'src/app/services/locations.service';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { SpeakerSelectComponent } from 'src/app/components/speaker-select/speaker-select.component';
import { ActivityType } from 'functions/src/activities/activity.model';
import { Location } from 'functions/src/locations/location.model';

@Component({
  selector: 'app-activity-create',
  templateUrl: './activity-create.component.html',
  styleUrls: ['./activity-create.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class ActivityCreateComponent implements OnInit, OnDestroy {
  readonly defaultSpeakerImage = '../../assets/img/user-badge.png';

  activityTypesSubscription: Subscription;
  types: ActivityType[] = [];

  locationsSubscription: Subscription;
  locations: Location[] = [];

  createActivityFormGroup: FormGroup;
  isLoading = false;
  speakers = [];

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private activitiesAdmin: AdminActivitiesService,
    private locationsService: LocationsService,
    private router: Router,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.createActivityFormGroup = this.formBuilder.group({
      nameCtrl: new FormControl('', [Validators.required]),
      descriptionCtrl: new FormControl('', [Validators.required]),
      startDateCtrl: new FormControl(''),
      endDateCtrl: new FormControl(''),
      registrationDateCtrl: new FormControl({ value: '', disabled: true }),
      startTimeCtrl: new FormControl(''),
      endTimeCtrl: new FormControl(''),
      registrationTimeCtrl: new FormControl({ value: '', disabled: true }),
      typeCtrl: new FormControl('', [Validators.required]),
      locationCtrl: new FormControl(''),
      maxCapacityCtrl: new FormControl(),
      preRegistrationCtrl: new FormControl(false),
      visibleCtrl: new FormControl(true),
    });

    this.activityTypesSubscription = this.activitiesAdmin.getActivityTypes().subscribe(types => {
      this.types = _.sortBy(types, ['name']);
    });

    this.locationsSubscription = this.locationsService.getLocations().subscribe(locations => {
      this.locations = locations;
    });
  }

  ngOnDestroy(): void {
    if (this.activityTypesSubscription) { this.activityTypesSubscription.unsubscribe(); }
    if (this.locationsSubscription) { this.locationsSubscription.unsubscribe(); }
  }

  createActivity(): void {
    console.log(this.createActivityFormGroup.controls);

    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Confirmar cadastro',
        alertDescription: 'Deseja realmente cadastrado esta atividade?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        // const activity = {
        //   ...this.newSpeaker,
        //   imageUrl: this.fileUploader.getDocumentUrl()
        // };

        // this.activitiesAdmin.createActivity(activity).then(() => {
        //   this.isCreateMode = false;
        //   this.clearNewSpeaker();
        //   this.snackbar.open('Atividade cadastrada!', null, {
        //     duration: 2000,
        //   });
        //   this.router.navigate(['/admin/atividades'])
        // }).catch(err => {
        //   console.error('Error creating activity', err);

        //   this.dialog.open(AlertDialogComponent, {
        //     maxWidth: '600px',
        //     data: {
        //       alertTitle: 'Erro ao cadastrar',
        //       alertDescription: 'Não foi possível cadastrar a atividade. Tente novamente mais tarde.',
        //       isOnlyConfirm: true,
        //     }
        //   });
        // });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  setRegistrationFields(): void {
    if (this.createActivityFormGroup.controls.preRegistrationCtrl.value) {
      this.createActivityFormGroup.controls.registrationDateCtrl.enable();
      this.createActivityFormGroup.controls.registrationTimeCtrl.enable();
    } else {
      this.createActivityFormGroup.controls.registrationDateCtrl.disable();
      this.createActivityFormGroup.controls.registrationDateCtrl.setValue('');
      this.createActivityFormGroup.controls.registrationTimeCtrl.disable();
      this.createActivityFormGroup.controls.registrationTimeCtrl.setValue('');
    }
  }

  removeSpeaker(i: number) {
    this.speakers.splice(i, 1);
  }

  addSpeaker() {
    const selectSubscription = this.dialog.open(SpeakerSelectComponent, {
      minWidth: '300px',
      maxWidth: '700px',
    }).afterClosed().subscribe(speaker => {
      if (speaker && !_.find(this.speakers, ['id', speaker.id])) {
        this.speakers.push(speaker);
      }

      if (selectSubscription) { selectSubscription.unsubscribe(); }
    });
  }
}
