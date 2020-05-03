import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  user: User;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {      
      this.user = user;
    })
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  resendConfirmation() {
    this.authService.resendVerificationEmail().then(() => {
      console.log('Enviado');
      // TODO: dialog
    }).catch(err => {
      console.error('Error resendinf e-mail verification', err);
      // TODO: dialog
    });
  }

}
