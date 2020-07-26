import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { User } from 'functions/src/users/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityAttendance } from 'functions/src/activities/activity.model';
import { AdminActivitiesService } from 'src/app/services/admin-activities.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-activity-attendances',
  templateUrl: './activity-attendances.component.html',
  styleUrls: ['./activity-attendances.component.scss']
})
export class ActivityAttendancesComponent implements OnInit, OnDestroy {
  activity: string;
  attendants: ActivityAttendance[] = [];
  attendantsSubscription: Subscription;
  attendantsDataSource: MatTableDataSource<ActivityAttendance>;

  loggedUser: string;
  userSubscription: Subscription;

  users: User[];
  usersSubscription: Subscription;

  isLoading = true;
  searchValue = '';
  filteredUsers: User[] = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private activitiesAdmin: AdminActivitiesService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ActivityAttendancesComponent>,
    private snackbar: MatSnackBar,
    private usersAdmin: AdminUsersService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.activity = data.activity;
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.loggedUser = user.uid;
    });

    this.attendantsSubscription = this.activitiesAdmin.getAttendants(this.activity).subscribe(attendants => {
      this.attendants = attendants;
      this.attendantsDataSource = new MatTableDataSource(_.reverse(_.sortBy(attendants, a => a.registeredAt?.toDate()?.toISOString())));
      this.attendantsDataSource.paginator = this.paginator;
    });

    this.userSubscription = this.usersAdmin.getUsers().subscribe(users => {
      this.users = _.sortBy(users, ['name']);
      this.filteredUsers = this.users;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.attendantsSubscription) { this.attendantsSubscription.unsubscribe(); }
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
    if (this.usersSubscription) { this.usersSubscription.unsubscribe(); }
  }

  getUserEmail(uid: string) {
    return _.find(this.users, ['uid', uid])?.email || '-';
  }

  getUserName(uid: string) {
    return _.find(this.users, ['uid', uid])?.name || '-';
  }

  isAttendant(user: User): boolean {
    return !!_.find(this.attendants, ['user', user.uid]);
  }

  onClose() {
    this.dialogRef.close(false);
  }

  onSelect(user: User) {
    this.activitiesAdmin.createAttendant(this.activity, {
      user: user.uid,
      registeredBy: this.loggedUser,
    }).then(() => {
      this.snackbar.open(`Presença registrada - ${user.email}`, null, {
        duration: 2000,
      });
    }).catch(err => {
      console.error('Error adding attendance', user.email, err);
      this.snackbar.open(`Erro ao registrar - ${user.email}`, null, {
        duration: 1500,
      });
    });

  }

  onRemove(user: User) {
    this.activitiesAdmin.deleteAttendant(this.activity, user.uid).then(() => {
      this.snackbar.open(`Presença removida - ${user.email}`, null, {
        duration: 2000,
      });
    }).catch(err => {
      console.error('Error removing attendance', user.email, err);
      this.snackbar.open(`Erro ao remover - ${user.email}`, null, {
        duration: 1500,
      });
    });
  }

  searchUsers() {
    this.isLoading = true;
    this.filteredUsers = _.filter(this.users, s => (
      s.name.trim().toUpperCase().indexOf(this.searchValue.trim().toUpperCase()) >= 0 ||
      s.email.trim().toUpperCase().indexOf(this.searchValue.trim().toUpperCase()) >= 0
    ));
    this.isLoading = false;
  }
}
