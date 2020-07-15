import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NgBrazilValidators, MASKS } from 'ng-brazil';
import { User } from 'functions/src/users/user.model';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  readonly MASKS = MASKS;

  userSubscription: Subscription;
  user: User;

  editUserFormGroup: FormGroup;

  isLoading = true;
  isProcessing = false;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private angularFireAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    const passwordMatchValidator = (formGroup: FormGroup): void => {
      const error = formGroup.get('newPasswordCtrl').value === formGroup.get('confirmCtrl').value ? null : { mismatch: true };
      formGroup.get('confirmCtrl').setErrors(error);
    };

    const newPasswordLengthValidator = (formGroup: FormGroup): void => {
      const error = formGroup.get('newPasswordCtrl').value !== '' &&
        formGroup.get('newPasswordCtrl').value.length < 6 ? { minlength: true } : null;
      formGroup.get('newPasswordCtrl').setErrors(error);
    };

    this.editUserFormGroup = this.formBuilder.group({
      nameCtrl: new FormControl('', [Validators.required]),
      emailCtrl: new FormControl('', [Validators.required, Validators.email]),
      phoneCtrl: new FormControl('', [Validators.required]),
      cpfCtrl: new FormControl('', [Validators.required, NgBrazilValidators.cpf]),
      passwordCtrl: new FormControl('', [Validators.required]),
      newPasswordCtrl: new FormControl('', []),
      confirmCtrl: new FormControl('', []),
    }, { validators: [passwordMatchValidator, newPasswordLengthValidator] });

    this.userSubscription = this.authService.user.subscribe(user => {
      this.user = user;
      this.fillUserData();
      this.isLoading = false;
    });

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
      });
    }).catch(err => {
      console.error('Error resending e-mail verification', err);

      this.dialog.open(AlertDialogComponent, {
        maxWidth: '600px',
        data: {
          alertTitle: 'Erro',
          alertDescription: 'Ocorreu um erro ao enviar ao e-mail de confirmação. Tente novamente.',
          isOnlyConfirm: true
        }
      });
    });
  }

  async editUser(): Promise<void> {
    this.isProcessing = true;

    if (this.editUserFormGroup.valid) {
      this.angularFireAuth.signInWithEmailAndPassword(
        this.editUserFormGroup.get('emailCtrl').value,
        this.editUserFormGroup.get('passwordCtrl').value
      ).then(() => {
        console.log('Signed in');

        const changedPassword = this.editUserFormGroup.get('newPasswordCtrl').value && this.editUserFormGroup.get('confirmCtrl').value;

        if (this.hasChangedFieldValues() && changedPassword) {
          console.log('Changed data and password');

          this.saveData().then(() => {
            console.log('Data successfully saved');

            this.savePassword().then(() => {
              console.log('Password successfully changed');

              this.resetFields();

              this.dialog.open(AlertDialogComponent, {
                maxWidth: '600px',
                data: {
                  alertTitle: 'Dados alterados',
                  alertDescription: 'Seus dados e nova senha foram alterados com sucesso.',
                  isOnlyConfirm: true
                }
              });

              this.isProcessing = false;
            }).catch(err => {
              console.error('Error changing password.', err);

              this.resetFields();

              this.dialog.open(AlertDialogComponent, {
                maxWidth: '600px',
                data: {
                  alertTitle: 'Erro ao alterar senha',
                  alertDescription: 'Seus novos dados foram salvos, mas ocorreu um erro ao alterar a senha. Tente alterá-la novamente mais tarde.',
                  isOnlyConfirm: true
                }
              });

              this.isProcessing = false;
            });

          }).catch(err => {
            console.error('Error changing data', err);

            this.resetFields();

            this.dialog.open(AlertDialogComponent, {
              maxWidth: '600px',
              data: {
                alertTitle: 'Erro ao salvar dados',
                alertDescription: 'Ocorreu um erro ao salvar seus dados. Tente novamente mais tarde.',
                isOnlyConfirm: true
              }
            });

            this.isProcessing = false;
          });
        } else if (this.hasChangedFieldValues()) {
          console.log('Changed only data');

          this.saveData().then(() => {
            console.log('Data successfully saved');

            this.resetFields();

            this.dialog.open(AlertDialogComponent, {
              maxWidth: '600px',
              data: {
                alertTitle: 'Dados alterados',
                alertDescription: 'Seus dados foram alterados com sucesso.',
                isOnlyConfirm: true
              }
            });

            this.isProcessing = false;
          }).catch(err => {
            console.error('Error changing data', err);

            this.resetFields();

            this.dialog.open(AlertDialogComponent, {
              maxWidth: '600px',
              data: {
                alertTitle: 'Erro ao salvar dados',
                alertDescription: 'Ocorreu um erro ao salvar seus dados. Tente novamente mais tarde.',
                isOnlyConfirm: true
              }
            });

            this.isProcessing = false;
          });

        } else if (changedPassword) {
          console.log('Changed only password');

          this.savePassword().then(() => {
            console.log('Password successfully changed');

            this.resetFields();

            this.dialog.open(AlertDialogComponent, {
              maxWidth: '600px',
              data: {
                alertTitle: 'Senha alterada com sucesso',
                alertDescription: 'Sua nova senha foi alterada com sucesso.',
                isOnlyConfirm: true
              }
            });

            this.isProcessing = false;
          }).catch(err => {
            console.error('Error changing password.', err);

            this.resetFields();

            this.dialog.open(AlertDialogComponent, {
              maxWidth: '600px',
              data: {
                alertTitle: 'Erro ao alterar senha',
                alertDescription: 'Ocorreu um erro ao alterar a senha. Tente alterá-la novamente mais tarde.',
                isOnlyConfirm: true
              }
            });

            this.isProcessing = false;
          });
        }
      }).catch(err => {
        console.error('Erro ao reautenticar.', err);

        this.resetFields();

        if (err.code = 'auth/wrong-password') {
          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Senha incorreta',
              alertDescription: 'A senha atual informada é incorreta. Verifique e tente novamente.',
              isOnlyConfirm: true
            }
          });
        } else {
          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao autenticar',
              alertDescription: 'Ocorreu um erro ao autenticar. Tente novamente mais tarde.',
              isOnlyConfirm: true
            }
          });
        }

        this.isProcessing = false;
      });

    }
  }

  resetFields(): void {
    this.editUserFormGroup.get('passwordCtrl').reset();
    this.editUserFormGroup.get('passwordCtrl').setErrors(null);
    this.editUserFormGroup.get('passwordCtrl').markAsUntouched();

    this.editUserFormGroup.get('newPasswordCtrl').setValue('');
    this.editUserFormGroup.get('newPasswordCtrl').setErrors(null);
    this.editUserFormGroup.get('newPasswordCtrl').markAsUntouched();

    this.editUserFormGroup.get('confirmCtrl').setValue('');
    this.editUserFormGroup.get('confirmCtrl').setErrors(null);
    this.editUserFormGroup.get('confirmCtrl').markAsUntouched();
  }

  fillUserData(): void {
    this.editUserFormGroup.get('nameCtrl').setValue(this.user?.name || '');
    this.editUserFormGroup.get('emailCtrl').setValue(this.user?.email || '');
    this.editUserFormGroup.get('phoneCtrl').setValue(this.user?.phone || '');
    this.editUserFormGroup.get('cpfCtrl').setValue(this.user?.cpf || '');
    this.editUserFormGroup.get('passwordCtrl').setValue('');
    this.editUserFormGroup.get('newPasswordCtrl').setValue('');
    this.editUserFormGroup.get('confirmCtrl').setValue('');
  }

  hasChangedFieldValues(): boolean {
    if (
      this.user.name !== this.editUserFormGroup.get('nameCtrl').value.trim().toUpperCase() ||
      this.user.phone !== this.editUserFormGroup.get('phoneCtrl').value ||
      this.user.cpf !== this.editUserFormGroup.get('cpfCtrl').value
    ) { return true; }
    return false;
  }

  shouldButtonDisable(): boolean {
    const changedPassword = this.editUserFormGroup.get('newPasswordCtrl').value && this.editUserFormGroup.get('confirmCtrl').value;
    return !((this.hasChangedFieldValues() || changedPassword) && this.editUserFormGroup.get('passwordCtrl').value);
  }

  saveData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authService.editUser({
        uid: this.user.uid,
        name: this.editUserFormGroup.get('nameCtrl').value.trim().toUpperCase(),
        phone: this.editUserFormGroup.get('phoneCtrl').value,
        cpf: this.editUserFormGroup.get('cpfCtrl').value || ''
      }).then(res => resolve(res)).catch(err => {
        reject(err);
      });
    });
  }

  savePassword(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.angularFireAuth.currentUser;
        user.updatePassword(this.editUserFormGroup.get('newPasswordCtrl').value).then((res) => resolve(res)).catch(err => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  }
}
