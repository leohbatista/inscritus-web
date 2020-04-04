import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImportsModule } from './common/imports.module';
import { HomeComponent } from './containers/home/home.component';
import { LoggedUserTemplateComponent } from './templates/logged-user-template/logged-user-template.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoggedUserTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ImportsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
