import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'inscritus-web';

  sessionTokenSubscription: Subscription;

  constructor(
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sessionTokenSubscription = this.authService.idTokenUser.subscribe((userToken) => {
      if (userToken) {
        this.authService.userSessionToken = userToken;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sessionTokenSubscription) { this.sessionTokenSubscription.unsubscribe(); }
  }
}
