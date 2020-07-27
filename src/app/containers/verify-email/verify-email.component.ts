import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  resetPasswordForm: FormGroup;
  isLoading = true;
  isProcessing = false;
  continueUrl: string;
  actionCode: string;
  mode: string;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadResetPasswordForm();

    this.mode = this.route.snapshot.queryParams.mode;
    this.actionCode = this.route.snapshot.queryParams.oobCode;
    this.continueUrl = this.route.snapshot.queryParams.continueUrl || '/entrar';

    if (this.mode === 'verifyEmail') {
      this.isLoading = false;
      this.authService.confirmEmail(this.actionCode).then(() => {
        this.router.navigate([this.continueUrl]);
      }).catch(err => {
        console.error('Error confirming e-mail', err);

        const dialogSubscription = this.dialog.open(AlertDialogComponent, {
          maxWidth: '600px',
          data: {
            alertTitle: 'Erro',
            alertDescription: 'Ocorreu um erro ao confirmar seu e-mail. Tente novamente mais tarde.',
            isOnlyConfirm: true
          }
        }).afterClosed().subscribe(() => {
          if(dialogSubscription) { dialogSubscription.unsubscribe(); }
          this.router.navigate(['/entrar']);
        });
      });
    } else if (this.mode === 'resetPassword') {
      this.authService.confirmResetCode(this.actionCode).then(email => {
        if (email) {
          this.resetPasswordForm.get('emailCtrl').setValue(email);
          this.isLoading = false;
        } else {
          const errorSubscription =  this.showMessage(
            'Erro', 'Ocorreu um erro ao validar o código. Tente novamente mais tarde.'
          ).afterClosed().subscribe(() => {
            if (errorSubscription) { errorSubscription.unsubscribe(); }
            this.router.navigate(['/entrar']);
          });
        }
      }).catch(err => {
        console.error('Error validating auth code', err);

        if (err.code === 'auth/invalid-action-code') {
          const errorSubscription =  this.showMessage(
            'Erro - Código incorreto', 'O código de verificação está incorreto ou já foi utilizado. Solicite a redefinição novamente.'
          ).afterClosed().subscribe(() => {
            if (errorSubscription) { errorSubscription.unsubscribe(); }
            this.router.navigate(['/entrar']);
          });
        } else if (err.code === 'auth/expired-action-code') {
          const errorSubscription =  this.showMessage(
            'Erro - Código expirado', 'O código de validação está expirado. Solicite a redefinição novamente.'
          ).afterClosed().subscribe(() => {
            if (errorSubscription) { errorSubscription.unsubscribe(); }
            this.router.navigate(['/entrar']);
          });
        } else {
          const errorSubscription =  this.showMessage(
            'Erro', 'Ocorreu um erro ao validar o código. Tente novamente mais tarde.'
          ).afterClosed().subscribe(() => {
            if (errorSubscription) { errorSubscription.unsubscribe(); }
            this.router.navigate(['/entrar']);
          });
        }
      });
    } else {
      const errorSubscription =  this.showMessage('Modo inválido', 'Este modo não é suportado.').afterClosed().subscribe(() => {
        if (errorSubscription) { errorSubscription.unsubscribe(); }
        this.router.navigate(['/entrar']);
      });
    }
  }

  loadResetPasswordForm(): void {
    function passwordMatchValidator(formGroup: FormGroup) {
      let error = null;
      if (formGroup.get('newPasswordCtrl').value !== formGroup.get('confirmNewPasswordCtrl').value) {
        error = { mismatch: true };
      }
      formGroup.get('confirmNewPasswordCtrl').setErrors(error);
    }

    this.resetPasswordForm = this.formBuilder.group({
      emailCtrl: new FormControl({ value: '', disabled: true }, Validators.required),
      newPasswordCtrl: new FormControl('', Validators.required),
      confirmNewPasswordCtrl: new FormControl('', Validators.required)
    }, { validator: passwordMatchValidator });
  }

  showMessage(title: string, message: string): MatDialogRef<AlertDialogComponent> {
    return this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: title,
        alertDescription: message,
        isOnlyConfirm: true
      }
    });
  }

  saveNewPassword() {
    this.isProcessing = true;
    this.authService.resetPassword(
      this.actionCode,
      this.resetPasswordForm.get('newPasswordCtrl').value,
      this.resetPasswordForm.get('emailCtrl').value?.trim().toLowerCase()
    ).then(() => {
      const msgSubscription =  this.showMessage('Senha alterada', 'A sua senha foi alterada com sucesso.').afterClosed().subscribe(() => {
        if (msgSubscription) { msgSubscription.unsubscribe(); }
        this.router.navigate([this.continueUrl || '/entrar']);
      });
    }).catch(err => {
      const errorSubscription =  this.showMessage(
        'Erro ao salvar', 'Erro ao salvar a nova senha. Tente novamente.'
      ).afterClosed().subscribe(() => {
        if (errorSubscription) { errorSubscription.unsubscribe(); }
        this.isProcessing = false;
      });
    });
  }
}
