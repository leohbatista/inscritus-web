import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { Activity, ActivityType } from 'functions/src/activities/activity.model';
import { Location } from 'functions/src/locations/location.model';
import { Speaker } from 'functions/src/speakers/speaker.model';
import { FavoriteActivity } from 'functions/src/users/user.model';
import { LocationsService } from 'src/app/services/locations.service';
import { AdminActivitiesService } from 'src/app/services/admin-activities.service';
import { SpeakersService } from 'src/app/services/speakers.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  user: string;
  userSubscription: Subscription;

  favoriteActivities: FavoriteActivity[];
  favoritesSubscription: Subscription;

  loadedActivities = false;
  activitiesByDay: { [day: string]: Activity[] };
  activitiesWithoutDate: Activity[];
  dates = [];

  locations: Location[];
  speakers: Speaker[];
  types: ActivityType[];

  activitiesSubscription: Subscription;
  activityTypesSubscription: Subscription;
  locationsSubscription: Subscription;
  speakersSubscription: Subscription;

  constructor(
    private activitiesAdmin: AdminActivitiesService,
    private authService: AuthService,
    private locationsService: LocationsService,
    private speakersService: SpeakersService,
    private usersAdmin: AdminUsersService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.activitiesSubscription = this.activitiesAdmin.getActivities().subscribe(activities => {
      this.activitiesByDay = _.groupBy(_.sortBy(_.filter(activities, a => a.visible), ['startDate']), 'startDate');
      this.activitiesWithoutDate = _.concat(
        (this.activitiesByDay.null || []),
        (this.activitiesByDay.undefined || []),
        (this.activitiesByDay[''] || [])
      );
      this.activitiesByDay = _.omit(this.activitiesByDay, ['', 'null', 'undefined']);
      this.dates = Object.keys(this.activitiesByDay).map(d => ({ key: d, value: moment(d).format('DD/MM/YYYY') }));

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

    this.userSubscription = this.authService.user.subscribe(user => {
      this.user = user.uid;

      this.favoritesSubscription = this.usersAdmin.getFavoriteActivities(user.uid).subscribe(favorites => {
        this.favoriteActivities = favorites;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.activitiesSubscription) { this.activitiesSubscription.unsubscribe(); }
    if (this.activityTypesSubscription) { this.activityTypesSubscription.unsubscribe(); }
    if (this.locationsSubscription) { this.locationsSubscription.unsubscribe(); }
    if (this.speakersSubscription) { this.speakersSubscription.unsubscribe(); }
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
    if (this.favoritesSubscription) { this.favoritesSubscription.unsubscribe(); }
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

  isFavorite(activity: Activity): boolean {
    return !!_.find(this.favoriteActivities, ['activity', activity.id]);
  }

  toggleFavorite(activity: Activity): void {
    if (this.isFavorite(activity)) {
      this.usersAdmin.removeFavoriteActivity(this.user, activity.id).then(() => {
        this.snackbar.open('Atividade removida dos favoritos', null, {
          duration: 2000,
        });
      }).catch(err => {
        console.error('Error favoriting activity', activity.id, err);
        this.snackbar.open('Erro', null, {
          duration: 1500,
        });
      });
    } else {
      this.usersAdmin.addFavoriteActivity(this.user, activity.id).then(() => {
        this.snackbar.open('Atividade adicionada aos favoritos', null, {
          duration: 2000,
        });
      }).catch(err => {
        console.error('Error favoriting activity', activity.id, err);
        this.snackbar.open('Erro', null, {
          duration: 1500,
        });
      });
    }
  }
}
