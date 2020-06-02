import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './auth/auth.guard';
import { AdminGuardService } from './auth/admin.guard';

import { HomeComponent } from './containers/home/home.component';
import { LoginComponent } from './containers/login/login.component';
import { SignupComponent } from './containers/signup/signup.component';
import { VerifyEmailComponent } from './containers/verify-email/verify-email.component';

import { ProfileComponent } from './containers/user-side/profile/profile.component';
import { ActivitiesComponent } from './containers/user-side/activities/activities.component';
import { ScheduleComponent } from './containers/user-side/schedule/schedule.component';

import { UserListComponent } from './containers/admin-side/user-list/user-list.component';
import { UserViewComponent } from './containers/admin-side/user-view/user-view.component';
import { UserEditComponent } from './containers/admin-side/user-edit/user-edit.component';
import { UserCreateComponent } from './containers/admin-side/user-create/user-create.component';

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
      
      { path: 'usuarios', component: UserListComponent, canActivate: [AdminGuardService] },
      { path: 'usuarios/criar', component: UserCreateComponent, canActivate: [AdminGuardService] },
      { path: 'usuarios/:uid', component: UserViewComponent, canActivate: [AdminGuardService] },
      { path: 'usuarios/:uid/editar', component: UserEditComponent, canActivate: [AdminGuardService] },
      
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
