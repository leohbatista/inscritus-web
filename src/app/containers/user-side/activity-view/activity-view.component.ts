import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  activityRegistrationsSubscription: Subscription;
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

  currentDate: moment.Moment;
  isRegistered: boolean;
  registrationQuantity = 0;
  userRegistrationsSubscription: Subscription;

  constructor(
    private activitiesAdmin: AdminActivitiesService,
    private authService: AuthService,
    private dialog: MatDialog,
    private locationService: LocationsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private speakersService: SpeakersService,
    private usersAdmin: AdminUsersService,

  ) { }

  ngOnInit(): void {
    this.refreshDate();
    this.activityId = this.route.snapshot.paramMap.get('id');

    this.activitySubscription = this.activitiesAdmin.getActivity(this.activityId).subscribe(activity => {
      if (!activity.visible) {
        this.router.navigate(['/cronograma']);
      }

      this.activity = activity;

      this.refreshDate();

      if (activity.type) {
        this.activityTypeSubscription = this.activitiesAdmin.getActivityType(this.activity.type).subscribe(type => {
          this.type = type;
          this.refreshDate();
        });
      }

      if (activity.location) {
        this.locationSubscription = this.locationService.getLocation(this.activity.location).subscribe(location => {
          this.location = location;
          this.refreshDate();
        });
      }

      if (activity.speakers) {
        this.speakersSubscription = this.speakersService.getSpeakers().subscribe(speakers => {
          this.speakers = speakers.filter(s => this.activity.speakers.indexOf(s.id) >= 0);
          this.refreshDate();
        });
      }

      this.activityRegistrationsSubscription = this.activitiesAdmin.getRegistrations(this.activityId).subscribe(registrations => {
        this.registrationQuantity = registrations.length;
        this.refreshDate();
      });

      this.isLoading = false;
    });

    this.userSubscription = this.authService.user.subscribe(user => {
      this.user = user.uid;
      this.refreshDate();

      this.favoritesSubscription = this.usersAdmin.getFavoriteActivities(this.user).subscribe(favorites => {
        this.isFavorite = !!_.find(favorites, ['activity', this.activityId]);
        this.refreshDate();
      });

      this.attendancesSubscription = this.usersAdmin.getAttendances(user.uid).subscribe(attendances => {
        this.isAttendee = !!_.find(attendances, ['activity', this.activityId]);
        this.refreshDate();
      });

      this.userRegistrationsSubscription = this.usersAdmin.getRegistrations(user.uid).subscribe(registrations => {
        this.isRegistered = !!_.find(registrations, ['activity', this.activityId]);
        this.refreshDate();
      });
    });
  }

  ngOnDestroy() {
    if (this.activitySubscription) { this.activitySubscription.unsubscribe(); }
    if (this.activityRegistrationsSubscription) { this.activityRegistrationsSubscription.unsubscribe(); }
    if (this.activityTypeSubscription) { this.activityTypeSubscription.unsubscribe(); }
    if (this.attendancesSubscription) { this.attendancesSubscription.unsubscribe(); }
    if (this.favoritesSubscription) { this.favoritesSubscription.unsubscribe(); }
    if (this.locationSubscription) { this.locationSubscription.unsubscribe(); }
    if (this.userRegistrationsSubscription) { this.userRegistrationsSubscription.unsubscribe(); }
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

  hasOpened(): boolean {
    if (this.activity?.preRegistration) {
      if (this.activity.registrationDate && this.activity.registrationTime) {
        this.refreshDate();
        return !moment(`${this.activity.registrationDate} ${this.activity.registrationTime}`).isAfter(this.currentDate);
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  isFull(): boolean {
    return this.activity.maxCapacity && this.registrationQuantity >= this.activity.maxCapacity;
  }

  isRegistrationOpened(): boolean {
    if (this.activity?.preRegistration) {
      return !this.isFull() && this.hasOpened();
    } else {
      return false;
    }
  }

  refreshDate(): void {
    this.currentDate = moment();
    console.log(this.currentDate);
  }

  register(): void {
    this.activitiesAdmin.createRegistration(this.activityId, {
      user: this.user,
    }).then(() => {
      this.snackbar.open(`Inscrição registrada`, null, {
        duration: 2000,
      });
    }).catch(err => {
      console.error('Error adding registration', err);
      this.snackbar.open(`Erro ao registrar`, null, {
        duration: 1500,
      });
    });
  }

  removeRegistration(): void {
    this.activitiesAdmin.deleteRegistration(this.activityId, this.user).then(() => {
      this.snackbar.open(`Inscrição cancelada`, null, {
        duration: 2000,
      });
    }).catch(err => {
      console.error('Error removing registration', err);
      this.snackbar.open(`Erro ao cancelar`, null, {
        duration: 1500,
      });
    });
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
