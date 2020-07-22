import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { Activity, ActivityType } from 'functions/src/activities/activity.model';
import { Speaker } from 'functions/src/speakers/speaker.model';
import { Location } from 'functions/src/locations/location.model';
import { AdminActivitiesService } from 'src/app/services/admin-activities.service';
import { LocationsService } from 'src/app/services/locations.service';
import { SpeakersService } from 'src/app/services/speakers.service';
import { SpeakerDetailComponent } from 'src/app/components/speaker-detail/speaker-detail.component';

@Component({
  selector: 'app-activity-view',
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.scss']
})
export class ActivityViewComponent implements OnInit, OnDestroy {
  readonly defaultLocationImage = '../../assets/img/location-badge.png';
  readonly defaultSpeakerImage = '../../assets/img/user-badge.png';

  activityId: string;
  activitySubscription: Subscription;
  activity: Activity;

  type: ActivityType;
  activityTypeSubscription: Subscription;

  location: Location;
  locationSubscription: Subscription;

  speakers: Speaker[];
  speakersSubscription: Subscription;

  isLoading = true;

  constructor(
    private activitiesAdmin: AdminActivitiesService,
    private dialog: MatDialog,
    private locationService: LocationsService,
    private route: ActivatedRoute,
    private speakersService: SpeakersService,
  ) { }

  ngOnInit(): void {
    this.activityId = this.route.snapshot.paramMap.get('id');

    this.activitySubscription = this.activitiesAdmin.getActivity(this.activityId).subscribe(activity => {
      this.activity = activity;

      this.activityTypeSubscription = this.activitiesAdmin.getActivityType(this.activity.type).subscribe(type => {
        this.type = type;
      });

      this.locationSubscription = this.locationService.getLocation(this.activity.location).subscribe(location => {
        this.location = location;
      });

      this.speakersSubscription = this.speakersService.getSpeakers().subscribe(speakers => {
        this.speakers = speakers.filter(s => this.activity.speakers.indexOf(s.id) >= 0);
      });

      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.activitySubscription) { this.activitySubscription.unsubscribe(); }
    if (this.activityTypeSubscription) { this.activityTypeSubscription.unsubscribe(); }
    if (this.locationSubscription) { this.locationSubscription.unsubscribe(); }
    if (this.speakersSubscription) { this.speakersSubscription.unsubscribe(); }
  }

  getDateTime(activity: Activity) {
    const startDate = moment(activity.startDate);
    const endDate = activity.endDate ? moment(activity.endDate) : null;

    return `${startDate.format('DD/MM/YYYY')} ${activity.startTime || ''}` +
      (!!endDate ? ` - ${endDate.format('DD/MM/YYYY')} ${activity.endTime || ''}` : '');
  }

  getRegistrationDateTime(activity: Activity) {
    if (activity.preRegistration && activity.registrationDate) {
      const regDate = moment(activity.registrationDate);
      return `${regDate.format('DD/MM/YYYY')} ${activity.registrationTime || ''}`;
    } else {
      return '-';
    }
  }

  viewSpeakerDetail(speaker: Speaker) {
    this.dialog.open(SpeakerDetailComponent, {
      maxWidth: '1000px',
      data: {
        speaker
      }
    });
  }
}
