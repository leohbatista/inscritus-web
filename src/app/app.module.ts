import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminGuardService } from './auth/admin.guard';
import { AuthGuardService } from './auth/auth.guard';
import { ImportsModule } from './common/imports.module';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ActivityCreateComponent } from './containers/admin-side/activity-create/activity-create.component';
import { ActivityEditComponent } from './containers/admin-side/activity-edit/activity-edit.component';
import { ActivityListComponent } from './containers/admin-side/activity-list/activity-list.component';
import { ActivityViewComponent } from './containers/admin-side/activity-view/activity-view.component';
import { SpeakerCreateComponent } from './containers/admin-side/speaker-create/speaker-create.component';
import { SpeakerEditComponent } from './containers/admin-side/speaker-edit/speaker-edit.component';
import { SpeakerListComponent } from './containers/admin-side/speaker-list/speaker-list.component';
import { SpeakerViewComponent } from './containers/admin-side/speaker-view/speaker-view.component';
import { UserCreateComponent } from './containers/admin-side/user-create/user-create.component';
import { UserEditComponent } from './containers/admin-side/user-edit/user-edit.component';
import { UserListComponent } from './containers/admin-side/user-list/user-list.component';
import { UserViewComponent } from './containers/admin-side/user-view/user-view.component';
import { HomeComponent } from './containers/home/home.component';
import { LoginComponent } from './containers/login/login.component';
import { SignupComponent } from './containers/signup/signup.component';
import { ActivitiesComponent } from './containers/user-side/activities/activities.component';
import { FeedComponent } from './containers/feed/feed.component';
import { ProfileComponent } from './containers/user-side/profile/profile.component';
import { ScheduleComponent } from './containers/user-side/schedule/schedule.component';
import { VerifyEmailComponent } from './containers/verify-email/verify-email.component';
import { PageTemplateComponent } from './templates/template/template.component';

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
    ActivityListComponent,
    ActivityCreateComponent,
    ActivityViewComponent,
    ActivityEditComponent,
    SpeakerListComponent,
    SpeakerCreateComponent,
    SpeakerEditComponent,
    SpeakerViewComponent,
    FeedComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ImportsModule,
  ],
  providers: [AuthGuardService, AdminGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
