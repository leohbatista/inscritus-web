import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';

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
    private dialog: MatDialog
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

      this.dialog.open(AlertDialogComponent, {
        maxWidth: '600px',
        data: {
          alertTitle: 'Confirmação enviada',
          alertDescription: 'Um e-mail de confirmação foi enviado. Verifique sua caixa de entrada',
          isOnlyConfirm: true
        }
      })
    }).catch(err => {
      console.error('Error resending e-mail verification', err);
      
      this.dialog.open(AlertDialogComponent, {
        maxWidth: '600px',
        data: {
          alertTitle: 'Erro',
          alertDescription: 'Ocorreu um erro ao enviar ao e-mail de confirmação. Tente novamente.',
          isOnlyConfirm: true
        }
      })
    });
  }

}
