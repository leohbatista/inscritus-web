import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;

  isForgotPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  forgotPassword(): void {
    this.isForgotPassword = true;
  }

  goToLogin(): void {
    this.isForgotPassword = false;
  }

  login(): void {
    this.authService.login(
      this.loginFormGroup.controls.email.value.trim().toLowerCase(),
      this.loginFormGroup.controls.password.value
    ).then(() => {
      this.router.navigate(['/minha-conta']);
    }).catch(err => {
      console.error(err);

      if (err.code === 'auth/user-not-found') {
        this.dialog.open(AlertDialogComponent, {
          maxWidth: '600px',
          data: {
            alertTitle: 'Usuário não encontrado',
            alertDescription: 'O usuário informado não possui cadastro. Verifique o e-mail digitado.',
            isOnlyConfirm: true
          }
        });
      } else if (err.code === 'auth/wrong-password') {
        this.dialog.open(AlertDialogComponent, {
          maxWidth: '600px',
          data: {
            alertTitle: 'Senha incorreta',
            alertDescription: 'A senha informada é incorreta. Tente novamente.',
            isOnlyConfirm: true
          }
        });
      } else {
        this.dialog.open(AlertDialogComponent, {
          maxWidth: '600px',
          data: {
            alertTitle: 'Erro',
            alertDescription: 'Ocorreu um erro ao realizar login. Tente novamente mais tarde.',
            isOnlyConfirm: true
          }
        });
      }
    });
  }

  sendResetPassword(): void {
    this.authService.sendPasswordResetEmail(this.loginFormGroup.controls.email.value.trim().toLowerCase()).then(() => {
      const msgSubscription = this.dialog.open(AlertDialogComponent, {
        maxWidth: '600px',
        data: {
          alertTitle: 'Redefinição enviada!',
          alertDescription: 'O e-mail de redefinição foi enviado. Acesse sua caixa de entrada e siga as instruções contidas no e-mail.',
          isOnlyConfirm: true
        }
      }).afterClosed().subscribe(() => {
        if (msgSubscription) { msgSubscription.unsubscribe(); }
        this.goToLogin();
      });
    }).catch(err => {
      this.dialog.open(AlertDialogComponent, {
        maxWidth: '600px',
        data: {
          alertTitle: 'Erro',
          alertDescription: 'Ocorreu um erro ao enviar o e-mail de redefinição. Tente novamente mais tarde.',
          isOnlyConfirm: true
        }
      });
    });
  }

}
