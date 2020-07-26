import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { User } from 'functions/src/users/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivityRegistration } from 'functions/src/activities/activity.model';
import { AdminActivitiesService } from 'src/app/services/admin-activities.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { Moment } from 'moment';

@Component({
  selector: 'app-activity-registrations',
  templateUrl: './activity-registrations.component.html',
  styleUrls: ['./activity-registrations.component.scss']
})
export class ActivityRegistrationsComponent implements OnInit, OnDestroy {
  activity: string;
  maxCapacity = 0;
  registered: ActivityRegistration[] = [];
  registeredSubscription: Subscription;
  registeredDataSource: MatTableDataSource<ActivityRegistration>;

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
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ActivityRegistrationsComponent>,
    private snackbar: MatSnackBar,
    private usersAdmin: AdminUsersService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.activity = data.activity;
    this.maxCapacity = data.maxCapacity;
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.loggedUser = user.uid;
    });

    this.registeredSubscription = this.activitiesAdmin.getRegistrations(this.activity).subscribe(registered => {
      this.registered = registered;
      this.registeredDataSource = new MatTableDataSource(_.reverse(_.sortBy(registered, a => a.registeredAt?.toDate()?.toISOString())));
      this.registeredDataSource.paginator = this.paginator;
    });

    this.userSubscription = this.usersAdmin.getUsers().subscribe(users => {
      this.users = _.sortBy(users, ['name']);
      this.filteredUsers = this.users;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.registeredSubscription) { this.registeredSubscription.unsubscribe(); }
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
    if (this.usersSubscription) { this.usersSubscription.unsubscribe(); }
  }

  createRegistration(user: User) {
    this.activitiesAdmin.createRegistration(this.activity, {
      user: user.uid,
      registeredBy: this.loggedUser,
    }).then(() => {
      this.snackbar.open(`Inscrição registrada - ${user.email}`, null, {
        duration: 2000,
      });
    }).catch(err => {
      console.error('Error adding registration', user.email, err);
      this.snackbar.open(`Erro ao registrar - ${user.email}`, null, {
        duration: 1500,
      });
    });
  }

  getUserEmail(uid: string) {
    return _.find(this.users, ['uid', uid])?.email || '-';
  }

  getUserName(uid: string) {
    return _.find(this.users, ['uid', uid])?.name || '-';
  }

  isAttendant(user: User): boolean {
    return !!_.find(this.registered, ['user', user.uid]);
  }

  onClose() {
    this.dialogRef.close(false);
  }

  onSelect(user: User) {
    if (this.registered?.length >= this.maxCapacity) {
      const confirmationSubscription = this.dialog.open(AlertDialogComponent, {
        maxWidth: '500px',
        data: {
          alertTitle: 'Confirmar inscrição',
          alertDescription: 'O número de inscritos excede o número de vagas. Deseja realmente inscrever o usuário nesta atividade?',
        }
      }).afterClosed().subscribe((result) => {
        if (result) {
          this.createRegistration(user);
        }
        if (confirmationSubscription) { confirmationSubscription.unsubscribe(); }
      });
    } else {
      this.createRegistration(user);
    }
  }

  onRemove(user: User) {
    this.activitiesAdmin.deleteRegistration(this.activity, user.uid).then(() => {
      this.snackbar.open(`Inscrição removida - ${user.email}`, null, {
        duration: 2000,
      });
    }).catch(err => {
      console.error('Error removing registration', user.email, err);
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
