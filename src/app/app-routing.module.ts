import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './containers/home/home.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { ActivitiesComponent } from './containers/activities/activities.component';
import { SignupComponent } from './containers/signup/signup.component';
import { LoginComponent } from './containers/login/login.component';
import { ScheduleComponent } from './containers/schedule/schedule.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'entrar', component: LoginComponent },
  { path: 'cadastro', component: SignupComponent },
  { path: 'atividades', component: ActivitiesComponent },
  { path: 'cronograma', component: ScheduleComponent },
  { path: 'minha-conta', component: ProfileComponent },
  { path: 'cronograma', component: ScheduleComponent },
  { path: 'minha-conta', component: ProfileComponent },
  { path: 'termos', component: HomeComponent },
  { path: 'privacidade', component: HomeComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
