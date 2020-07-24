import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { Activity, ActivityType } from 'functions/src/activities/activity.model';
import { Location } from 'functions/src/locations/location.model';
import { Speaker } from 'functions/src/speakers/speaker.model';
import { LocationsService } from 'src/app/services/locations.service';
import { AdminActivitiesService } from 'src/app/services/admin-activities.service';
import { SpeakersService } from 'src/app/services/speakers.service';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit, OnDestroy {

  loadedActivities = false;

  activities: Activity[];
  locations: Location[];
  speakers: Speaker[];
  types: ActivityType[];

  activitiesSubscription: Subscription;
  activityTypesSubscription: Subscription;
  locationsSubscription: Subscription;
  speakersSubscription: Subscription;

  constructor(
    private activitiesAdmin: AdminActivitiesService,
    private locationsService: LocationsService,
    private speakersService: SpeakersService,
  ) { }

  ngOnInit(): void {
    this.activitiesSubscription = this.activitiesAdmin.getActivities().subscribe(activities => {
      this.activities = _.sortBy(activities, ['name']);
      this.loadedActivities = true;
    });

    this.activityTypesSubscription = this.activitiesAdmin.getActivityTypes().subscribe(types => {
      this.types = types;
    });

    this.locationsSubscription = this.locationsService.getLocations().subscribe(locations => {
      this.locations = locations;
    });

    this.speakersSubscription = this.speakersService.getSpeakers().subscribe(speakers => {
      this.speakers = speakers;
    });
  }

  ngOnDestroy(): void {
    if (this.activitiesSubscription) { this.activitiesSubscription.unsubscribe(); }
    if (this.activityTypesSubscription) { this.activityTypesSubscription.unsubscribe(); }
    if (this.locationsSubscription) { this.locationsSubscription.unsubscribe(); }
    if (this.speakersSubscription) { this.speakersSubscription.unsubscribe(); }
  }

  getActivityType(typeId: string): string {
    return _.find(this.types, ['id', typeId])?.name || '-';
  }

  getLocation(locationId: string): string {
    return _.find(this.locations, ['id', locationId])?.name || '-';
  }

  getSpeakers(activity: Activity): string[] {
    return activity.speakers?.map(s => _.find(this.speakers, ['id', s])?.name || '');
  }

  getDateTime(activity: Activity) {
    if (activity.startDate) {
      const startDate = moment(activity.startDate);
      const endDate = activity.endDate ? moment(activity.endDate) : null;

      return `${startDate.format('DD/MM/YYYY')} ${activity.startTime || ''}` +
        (!!endDate ? ` - ${endDate.format('DD/MM/YYYY')} ${activity.endTime || ''}` : '');
    } else {
      return '-';
    }
  }
}
