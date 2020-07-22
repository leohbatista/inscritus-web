import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as moment from 'moment';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { AdminActivitiesService } from 'src/app/services/admin-activities.service';
import { LocationsService } from 'src/app/services/locations.service';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { SpeakerSelectComponent } from 'src/app/components/speaker-select/speaker-select.component';
import { ActivityType, Activity } from 'functions/src/activities/activity.model';
import { Location } from 'functions/src/locations/location.model';
import { SpeakersService } from 'src/app/services/speakers.service';
import { Speaker } from 'functions/src/speakers/speaker.model';

@Component({
  selector: 'app-activity-edit',
  templateUrl: './activity-edit.component.html',
  styleUrls: ['./activity-edit.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class ActivityEditComponent implements OnInit, OnDestroy {
  readonly defaultSpeakerImage = '../../assets/img/user-badge.png';

  activityId: string;

  activitySubscription: Subscription;
  activity: Activity;

  activityTypesSubscription: Subscription;
  types: ActivityType[] = [];

  locationsSubscription: Subscription;
  locations: Location[] = [];

  speakersSubscription: Subscription;
  speakers: Speaker[] = [];
  isLoadingSpeakers = true;

  editActivityFormGroup: FormGroup;
  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private activitiesAdmin: AdminActivitiesService,
    private locationsService: LocationsService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private speakersService: SpeakersService,
  ) { }

  ngOnInit(): void {
    this.activityId = this.route.snapshot.paramMap.get('id');;

    this.editActivityFormGroup = this.formBuilder.group({
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

    this.activitySubscription = this.activitiesAdmin.getActivity(this.activityId).subscribe(activity => {
      this.activity = activity;
      this.fillFields();

      this.speakersSubscription = this.speakersService.getSpeakers().subscribe(speakers => {
        this.speakers = speakers.filter(s => this.activity.speakers.indexOf(s.id) >= 0);
        this.isLoadingSpeakers = false;
      });
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
    if (this.speakersSubscription) { this.speakersSubscription.unsubscribe(); }
  }

  editActivity(): void {
    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Confirmar cadastro',
        alertDescription: 'Deseja realmente cadastrado esta atividade?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        const activity: Activity = {
          ...this.activity,
          description: this.editActivityFormGroup.get('descriptionCtrl').value,
          location: this.editActivityFormGroup.get('locationCtrl').value || null,
          maxCapacity: this.editActivityFormGroup.get('maxCapacityCtrl').value,
          name: this.editActivityFormGroup.get('nameCtrl').value,
          preRegistration: !!this.editActivityFormGroup.get('preRegistrationCtrl').value,
          speakers: this.speakers.map(s => s.id),
          type: this.editActivityFormGroup.get('typeCtrl').value,
          visible: !!this.editActivityFormGroup.get('visibleCtrl').value,
        };

        if (this.editActivityFormGroup.get('startDateCtrl').value) {
          activity.startTime = this.editActivityFormGroup.get('startTimeCtrl').value || null;
          activity.startDate = this.editActivityFormGroup.get('startDateCtrl').value?.format('YYYY-MM-DD');
        }

        if (this.editActivityFormGroup.get('endDateCtrl').value) {
          activity.endTime = this.editActivityFormGroup.get('endTimeCtrl').value || null;
          activity.endDate = this.editActivityFormGroup.get('endDateCtrl').value?.format('YYYY-MM-DD');
        }

        if (this.editActivityFormGroup.get('registrationDateCtrl').value) {
          activity.registrationTime = this.editActivityFormGroup.get('registrationTimeCtrl').value || null;
          activity.registrationDate = this.editActivityFormGroup.get('registrationDateCtrl').value?.format('YYYY-MM-DD');
        }

        this.activitiesAdmin.editActivity(activity).then(() => {
          this.snackbar.open('Atividade editada!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error editing activity', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao editar',
              alertDescription: 'Não foi possível editar a atividade. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  fillFields() {
    this.editActivityFormGroup.get('nameCtrl').setValue(this.activity.name);
    this.editActivityFormGroup.get('descriptionCtrl').setValue(this.activity.description);
    this.editActivityFormGroup.get('startDateCtrl').setValue(this.activity.startDate ? moment(this.activity.startDate) : '');
    this.editActivityFormGroup.get('endDateCtrl').setValue(this.activity.endDate ? moment(this.activity.endDate) : '');
    this.editActivityFormGroup.get('registrationDateCtrl').setValue(
      this.activity.registrationDate ? moment(this.activity.registrationDate) : ''
    );
    this.editActivityFormGroup.get('startTimeCtrl').setValue(this.activity.startTime);
    this.editActivityFormGroup.get('endTimeCtrl').setValue(this.activity.endTime);
    this.editActivityFormGroup.get('registrationTimeCtrl').setValue(this.activity.registrationTime);
    this.editActivityFormGroup.get('typeCtrl').setValue(this.activity.type);
    this.editActivityFormGroup.get('locationCtrl').setValue(this.activity.location);
    this.editActivityFormGroup.get('maxCapacityCtrl').setValue(this.activity.maxCapacity);
    this.editActivityFormGroup.get('preRegistrationCtrl').setValue(this.activity.preRegistration);
    this.editActivityFormGroup.get('visibleCtrl').setValue(this.activity.visible);
  }

  setRegistrationFields(): void {
    if (this.editActivityFormGroup.controls.preRegistrationCtrl.value) {
      this.editActivityFormGroup.controls.registrationDateCtrl.enable();
      this.editActivityFormGroup.controls.registrationTimeCtrl.enable();
    } else {
      this.editActivityFormGroup.controls.registrationDateCtrl.disable();
      this.editActivityFormGroup.controls.registrationDateCtrl.setValue('');
      this.editActivityFormGroup.controls.registrationTimeCtrl.disable();
      this.editActivityFormGroup.controls.registrationTimeCtrl.setValue('');
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
