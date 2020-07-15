import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.user = user;
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
