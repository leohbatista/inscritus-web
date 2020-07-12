import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuardService } from './auth/admin.guard';
import { AuthGuardService } from './auth/auth.guard';
import { ActivityCreateComponent } from './containers/admin-side/activity-create/activity-create.component';
import { ActivityEditComponent } from './containers/admin-side/activity-edit/activity-edit.component';
import { ActivityListComponent } from './containers/admin-side/activity-list/activity-list.component';
import { ActivityViewComponent } from './containers/admin-side/activity-view/activity-view.component';
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
import { SpeakersComponent } from './containers/speakers/speakers.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'entrar', component: LoginComponent },
  { path: 'cadastro', component: SignupComponent },
  { path: 'avisos', component: FeedComponent, canActivate: [AuthGuardService] },
  { path: 'atividades', component: ActivitiesComponent, canActivate: [AuthGuardService] },
  { path: 'cronograma', component: ScheduleComponent, canActivate: [AuthGuardService] },
  { path: 'palestrantes', component: SpeakersComponent, canActivate: [AuthGuardService] },
  { path: 'minha-conta', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'admin', children: [
    { path: '', pathMatch: 'full', component: HomeComponent, canActivate: [AdminGuardService] },
    { path: 'usuarios', component: UserListComponent, canActivate: [AdminGuardService] },
    { path: 'usuarios/criar', component: UserCreateComponent, canActivate: [AdminGuardService] },
    { path: 'usuarios/:uid', component: UserViewComponent, canActivate: [AdminGuardService] },
    { path: 'usuarios/:uid/editar', component: UserEditComponent, canActivate: [AdminGuardService] },
    { path: 'atividades', component: ActivityListComponent, canActivate: [AdminGuardService] },
    { path: 'atividades/criar', component: ActivityCreateComponent, canActivate: [AdminGuardService] },
    { path: 'atividades/:aid', component: ActivityViewComponent, canActivate: [AdminGuardService] },
    { path: 'atividades/:aid/editar', component: ActivityEditComponent, canActivate: [AdminGuardService] },
    { path: 'feedbacks', component: HomeComponent, canActivate: [AdminGuardService] },
    { path: 'cadastros-auxiliares', component: HomeComponent, canActivate: [AdminGuardService] },
    { path: '**', redirectTo: '' },
  ]},
  { path: 'verificar', component: VerifyEmailComponent },
  { path: 'termos', component: HomeComponent },
  { path: 'privacidade', component: HomeComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
