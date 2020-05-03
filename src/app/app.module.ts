import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImportsModule } from './common/imports.module';
import { HomeComponent } from './containers/home/home.component';
import { PageTemplateComponent } from './templates/template/template.component';
import { ActivitiesComponent } from './containers/activities/activities.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { LoginComponent } from './containers/login/login.component';
import { SignupComponent } from './containers/signup/signup.component';
import { ScheduleComponent } from './containers/schedule/schedule.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { VerifyEmailComponent } from './containers/verify-email/verify-email.component';

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
    VerifyEmailComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ImportsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
