import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ImportsModule } from './common/imports.module';

import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { PageTemplateComponent } from './templates/template/template.component';

import { AuthGuardService } from './auth/auth.guard';
import { AdminGuardService } from './auth/admin.guard';

import { HomeComponent } from './containers/home/home.component';
import { LoginComponent } from './containers/login/login.component';
import { SignupComponent } from './containers/signup/signup.component';
import { VerifyEmailComponent } from './containers/verify-email/verify-email.component';

import { ActivitiesComponent } from './containers/user-side/activities/activities.component';
import { ProfileComponent } from './containers/user-side/profile/profile.component';
import { ScheduleComponent } from './containers/user-side/schedule/schedule.component';

import { UserListComponent } from './containers/admin-side/user-list/user-list.component';
import { UserViewComponent } from './containers/admin-side/user-view/user-view.component';
import { UserEditComponent } from './containers/admin-side/user-edit/user-edit.component';
import { UserCreateComponent } from './containers/admin-side/user-create/user-create.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageTemplateComponent,
    ActivitiesComponent,
    ProfileComponent,
    LoginComponent,
    SignupComponent,
    ScheduleComponent,
    VerifyEmailComponent,
    AlertDialogComponent,
    UserListComponent,
    UserViewComponent,
    UserEditComponent,
    UserCreateComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ImportsModule,
  ],
  providers: [AuthGuardService, AdminGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
