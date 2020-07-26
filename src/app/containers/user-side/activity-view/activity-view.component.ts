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
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { FavoriteActivity } from 'functions/src/users/user.model';
import * as _ from 'lodash';

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

  user: string;
  userSubscription: Subscription;

  isFavorite: boolean;
  favoritesSubscription: Subscription;

  isAttendee: boolean;
  attendancesSubscription: Subscription;

  isLoading = true;

  constructor(
    private activitiesAdmin: AdminActivitiesService,
    private authService: AuthService,
    private dialog: MatDialog,
    private locationService: LocationsService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private speakersService: SpeakersService,
    private usersAdmin: AdminUsersService,

  ) { }

  ngOnInit(): void {
    this.activityId = this.route.snapshot.paramMap.get('id');

    this.activitySubscription = this.activitiesAdmin.getActivity(this.activityId).subscribe(activity => {
      this.activity = activity;

      if (activity.type) {
        this.activityTypeSubscription = this.activitiesAdmin.getActivityType(this.activity.type).subscribe(type => {
          this.type = type;
        });
      }

      if (activity.location) {
        this.locationSubscription = this.locationService.getLocation(this.activity.location).subscribe(location => {
          this.location = location;
        });
      }

      if (activity.speakers) {
        this.speakersSubscription = this.speakersService.getSpeakers().subscribe(speakers => {
          this.speakers = speakers.filter(s => this.activity.speakers.indexOf(s.id) >= 0);
        });
      }

      this.isLoading = false;
    });

    this.userSubscription = this.authService.user.subscribe(user => {
      this.user = user.uid;

      this.favoritesSubscription = this.usersAdmin.getFavoriteActivities(this.user).subscribe(favorites => {
        this.isFavorite = !!_.find(favorites, ['activity', this.activityId]);
      });

      this.attendancesSubscription = this.usersAdmin.getAttendances(user.uid).subscribe(attendances => {
        this.isAttendee = !!_.find(attendances, ['activity', this.activityId]);
      });

    });
  }

  ngOnDestroy() {
    if (this.activitySubscription) { this.activitySubscription.unsubscribe(); }
    if (this.activityTypeSubscription) { this.activityTypeSubscription.unsubscribe(); }
    if (this.attendancesSubscription) { this.attendancesSubscription.unsubscribe(); }
    if (this.favoritesSubscription) { this.favoritesSubscription.unsubscribe(); }
    if (this.locationSubscription) { this.locationSubscription.unsubscribe(); }
    if (this.speakersSubscription) { this.speakersSubscription.unsubscribe(); }
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
  }

  getDateTime(activity: Activity) {
    if (activity?.startDate) {
      const startDate = moment(activity.startDate);
      const endDate = activity.endDate ? moment(activity.endDate) : null;

      return `${startDate.format('DD/MM/YYYY')} ${activity.startTime || ''}` +
        (!!endDate ? ` - ${endDate.format('DD/MM/YYYY')} ${activity.endTime || ''}` : '');
    } else {
      return '-';
    }
  }

  getRegistrationDateTime(activity: Activity) {
    if (activity?.preRegistration && activity?.registrationDate) {
      const regDate = moment(activity.registrationDate);
      return `${regDate.format('DD/MM/YYYY')} ${activity.registrationTime || ''}`;
    } else {
      return '-';
    }
  }

  toggleFavorite(): void {
    if (this.isFavorite) {
      this.usersAdmin.removeFavoriteActivity(this.user, this.activityId).then(() => {
        this.snackbar.open('Atividade removida dos favoritos', null, {
          duration: 2000,
        });
      }).catch(err => {
        console.error('Error favoriting activity', this.activityId, err);
        this.snackbar.open('Erro', null, {
          duration: 1500,
        });
      });
    } else {
      this.usersAdmin.addFavoriteActivity(this.user, this.activityId).then(() => {
        this.snackbar.open('Atividade adicionada aos favoritos', null, {
          duration: 2000,
        });
      }).catch(err => {
        console.error('Error favoriting activity', this.activityId, err);
        this.snackbar.open('Erro', null, {
          duration: 1500,
        });
      });
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
