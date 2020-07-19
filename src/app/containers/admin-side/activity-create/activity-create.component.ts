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
import { ActivityType, Activity } from 'functions/src/activities/activity.model';
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
    }, { validators: this.dateValidator });

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
    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Confirmar cadastro',
        alertDescription: 'Deseja realmente cadastrado esta atividade?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        console.log(this.createActivityFormGroup);

        const activity: Activity = {
          description: this.createActivityFormGroup.get('descriptionCtrl').value,
          location: this.createActivityFormGroup.get('locationCtrl').value || null,
          maxCapacity: this.createActivityFormGroup.get('maxCapacityCtrl').value,
          name: this.createActivityFormGroup.get('nameCtrl').value,
          preRegistration: !!this.createActivityFormGroup.get('preRegistrationCtrl').value,
          speakers: this.speakers.map(s => s.id),
          type: this.createActivityFormGroup.get('typeCtrl').value,
          visible: !!this.createActivityFormGroup.get('visibleCtrl').value,
        };

        if (this.createActivityFormGroup.get('startDateCtrl').value) {
          activity.startTime = this.createActivityFormGroup.get('startTimeCtrl').value || null;
          activity.startDate = this.createActivityFormGroup.get('startDateCtrl').value?.format('YYYY-MM-DD');
        }

        if (this.createActivityFormGroup.get('endDateCtrl').value) {
          activity.endTime = this.createActivityFormGroup.get('endTimeCtrl').value || null;
          activity.endDate = this.createActivityFormGroup.get('endDateCtrl').value?.format('YYYY-MM-DD');
        }

        if (this.createActivityFormGroup.get('registrationDateCtrl').value) {
          activity.registrationTime = this.createActivityFormGroup.get('registrationTimeCtrl').value || null;
          activity.registrationDate = this.createActivityFormGroup.get('registrationDateCtrl').value?.format('YYYY-MM-DD');
        }
        console.log(activity);

        this.activitiesAdmin.createActivity(activity).then(() => {
          this.snackbar.open('Atividade cadastrada!', null, {
            duration: 2000,
          });
          this.router.navigate(['/admin/atividades']);
        }).catch(err => {
          console.error('Error creating activity', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao cadastrar',
              alertDescription: 'Não foi possível cadastrar a atividade. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
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



  // Validators
  dateValidator(formGroup: FormGroup): void {
    // Start Date
    if (!formGroup.get('startDateCtrl').value && (formGroup.get('startTimeCtrl').value || formGroup.get('endDateCtrl').value)) {
      formGroup.get('startDateCtrl').setErrors({ customReq: true });
    } else {
      formGroup.get('startDateCtrl').setErrors(null);
    }

    // End Date
    if (!formGroup.get('endDateCtrl').value && formGroup.get('endTimeCtrl').value) {
      formGroup.get('endDateCtrl').setErrors({ customReq: true });
    } else {
      formGroup.get('endDateCtrl').setErrors(null);
    }

    // Start Time
    if (!formGroup.get('startTimeCtrl').value && formGroup.get('endTimeCtrl').value) {
      formGroup.get('startTimeCtrl').setErrors({ customReq: true });
    } else {
      formGroup.get('startTimeCtrl').setErrors(null);
    }

    // End Time
    if (!formGroup.get('endTimeCtrl').value && formGroup.get('startTimeCtrl').value && formGroup.get('endDateCtrl').value) {
      formGroup.get('endTimeCtrl').setErrors({ customReq: true });
    } else {
      formGroup.get('endTimeCtrl').setErrors(null);
    }

    // Registration Date
    if (
      formGroup.get('preRegistrationCtrl').value &&
      !formGroup.get('registrationDateCtrl').value &&
      formGroup.get('registrationTimeCtrl').value
    ) {
      formGroup.get('registrationDateCtrl').setErrors({ customReq: true });
    } else {
      formGroup.get('registrationDateCtrl').setErrors(null);
    }

    // Registration  Time
    if (
      formGroup.get('preRegistrationCtrl').value &&
      !formGroup.get('registrationTimeCtrl').value &&
      formGroup.get('registrationDateCtrl').value
    ) {
      formGroup.get('registrationTimeCtrl').setErrors({ customReq: true });
    } else {
      formGroup.get('registrationTimeCtrl').setErrors(null);
    }

    // Validate end before start
    if (formGroup.get('startDateCtrl').value && formGroup.get('endDateCtrl').value) {
      const startDateStr = formGroup.get('startDateCtrl').value.format('YYYY-MM-DD');
      const endDateStr = formGroup.get('endDateCtrl').value.format('YYYY-MM-DD');

      console.log(startDateStr, endDateStr, formGroup.get('startTimeCtrl').value, formGroup.get('endTimeCtrl').value);

      formGroup.get('endDateCtrl').setErrors(null);

      if (startDateStr > endDateStr) {
        formGroup.get('endDateCtrl').setErrors({ endDate: true });
      } else if (startDateStr === endDateStr) {
        if (
          formGroup.get('startTimeCtrl').value && formGroup.get('endTimeCtrl').value &&
          formGroup.get('startTimeCtrl').value > formGroup.get('endTimeCtrl').value
        ) {
          formGroup.get('endTimeCtrl').setErrors({ endTime: true });
        } else {
          formGroup.get('endTimeCtrl').setErrors(null);
        }
      }
    }
  }
}
