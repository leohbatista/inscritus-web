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

import { HomeComponent } from './containers/home/home.component';
import { ActivitiesComponent } from './containers/activities/activities.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { LoginComponent } from './containers/login/login.component';
import { SignupComponent } from './containers/signup/signup.component';
import { ScheduleComponent } from './containers/schedule/schedule.component';
import { VerifyEmailComponent } from './containers/verify-email/verify-email.component';
import { AuthGuardService } from './auth/auth.guard';
import { AdminGuardService } from './auth/admin.guard';

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
