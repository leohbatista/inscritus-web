import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgBrazilValidators, MASKS } from 'ng-brazil';
import { User } from 'functions/src/users/user.model';

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

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    const passwordMatchValidator = (formGroup: FormGroup): void => {
      const error = formGroup.get('passwordCtrl').value === formGroup.get('confirmCtrl').value ? null : { 'mismatch': true };
      formGroup.get('confirmCtrl').setErrors(error);
    } 

    this.editUserFormGroup = this.formBuilder.group({
      nameCtrl: new FormControl('', [Validators.required]),
      emailCtrl: new FormControl('', [Validators.required, Validators.email]),
      phoneCtrl: new FormControl('', [Validators.required]),
      cpfCtrl: new FormControl('', [Validators.required, NgBrazilValidators.cpf]),
      passwordCtrl: new FormControl('', [Validators.required]),
      newPasswordCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]),
      confirmCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]),
    }, { validator: passwordMatchValidator });

    this.userSubscription = this.authService.user.subscribe(user => {      
      this.user = user;
      this.fillUserData();
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

  editUser(): void {
    if(this.editUserFormGroup.valid) {
      this.authService.createUser({
        name: (this.editUserFormGroup.get('nameCtrl').value as string).trim().toUpperCase(),
        email: (this.editUserFormGroup.get('emailCtrl').value as string).trim().toLowerCase(),
        phone: (this.editUserFormGroup.get('phoneCtrl').value as string).trim(),
        cpf: (this.editUserFormGroup.get('cpfCtrl').value as string).trim(),
      }, this.editUserFormGroup.get('passwordCtrl').value).then(res => {
        this.router.navigate(['/minha-conta']);
      }).catch(err => {
        console.error(err);
        this.dialog.open(AlertDialogComponent, {
          maxWidth: '600px',
          data: {
            alertTitle: 'Erro',
            alertDescription: 'Ocorreu um erro ao criar seu usuário. Tente novamente mais tarde.',
            isOnlyConfirm: true
          }
        })
      });
    }
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

}
