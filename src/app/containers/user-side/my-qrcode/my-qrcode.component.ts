import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'functions/src/users/user.model';

@Component({
  selector: 'app-my-qrcode',
  templateUrl: './my-qrcode.component.html',
  styleUrls: ['./my-qrcode.component.scss']
})
export class MyQrcodeComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  user: User;
  isLoading = true;

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  constructor(
    private authService: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 350px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.user = user;
      this.isLoading = false;
    });

    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
