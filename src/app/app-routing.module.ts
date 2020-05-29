import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './auth/auth.guard';
import { AdminGuardService } from './auth/admin.guard';

import { HomeComponent } from './containers/home/home.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { ActivitiesComponent } from './containers/activities/activities.component';
import { SignupComponent } from './containers/signup/signup.component';
import { LoginComponent } from './containers/login/login.component';
import { ScheduleComponent } from './containers/schedule/schedule.component';
import { VerifyEmailComponent } from './containers/verify-email/verify-email.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'entrar', component: LoginComponent },
  { path: 'cadastro', component: SignupComponent },
  { path: 'atividades', component: ActivitiesComponent, canActivate: [AuthGuardService] },
  { path: 'cronograma', component: ScheduleComponent, canActivate: [AuthGuardService] },
  { path: 'minha-conta', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'termos', component: HomeComponent },
  { path: 'privacidade', component: HomeComponent },
  { path: 'verificar', component: VerifyEmailComponent },
  { path: 'admin', children: [
      { path: '', pathMatch: 'full', component: HomeComponent, canActivate: [AdminGuardService] },
      { path: 'usuarios', component: HomeComponent, canActivate: [AdminGuardService] },
      { path: 'atividades', component: HomeComponent, canActivate: [AdminGuardService] },
      { path: 'feedbacks', component: HomeComponent, canActivate: [AdminGuardService] },
      { path: '**', redirectTo: '' },
    ]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
