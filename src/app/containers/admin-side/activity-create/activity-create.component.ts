import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { ActivityType } from 'functions/src/activities/activity.model';
import { AdminActivitiesService } from 'src/app/services/admin-activities.service';

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
  
  activityTypesSubscription: Subscription;
  types: ActivityType[] = [];

  createActivityFormGroup: FormGroup;
  isLoading = false;
  speakers = [];

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private activitiesAdmin: AdminActivitiesService,
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
      maxCapacityCtrl: new FormControl(),
      preRegistrationCtrl: new FormControl(false),
      visibleCtrl: new FormControl(true),
    });

    this.activityTypesSubscription = this.activitiesAdmin.getActivityTypes().subscribe(types => {
      this.types = types;
    })
  }

  ngOnDestroy(): void {
    if(this.activityTypesSubscription) { this.activityTypesSubscription.unsubscribe(); }
  }

  createActivity(): void {
    console.log('Create');

    console.log(this.createActivityFormGroup.controls);
    
    
  }

  setRegistrationFields(): void {
    if(this.createActivityFormGroup.controls.preRegistrationCtrl.value) {
      this.createActivityFormGroup.controls.registrationDateCtrl.enable();
      this.createActivityFormGroup.controls.registrationTimeCtrl.enable();
    } else {
      this.createActivityFormGroup.controls.registrationDateCtrl.disable();
      this.createActivityFormGroup.controls.registrationDateCtrl.setValue('');
      this.createActivityFormGroup.controls.registrationTimeCtrl.disable();
      this.createActivityFormGroup.controls.registrationTimeCtrl.setValue('');
    }
  }

}
