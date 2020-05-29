import { Component, OnInit } from '@angular/core';

import { AppInfo } from "src/config/app-info";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { MASKS, NgBrazilValidators } from 'ng-brazil';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public MASKS = MASKS;
  
  termsOfService = AppInfo.termsOfServiceLink;
  privacyPolicy = AppInfo.privacyPolicyLink;

  createUserFormGroup: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {    
    const passwordMatchValidator = (formGroup: FormGroup): void => {
      const error = formGroup.get('passwordCtrl').value === formGroup.get('confirmCtrl').value ? null : { 'mismatch': true };
      formGroup.get('confirmCtrl').setErrors(error);
    } 

    this.createUserFormGroup = this.formBuilder.group({
      nameCtrl: new FormControl('', [Validators.required]),
      emailCtrl: new FormControl('', [Validators.required, Validators.email]),
      phoneCtrl: new FormControl('', [Validators.required]),
      cpfCtrl: new FormControl('', [Validators.required, NgBrazilValidators.cpf]),
      passwordCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]),
      confirmCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]),
      termsCtrl: new FormControl(false, [Validators.required])
    }, { validator: passwordMatchValidator });

  }

  createUser(): void {
    if(this.createUserFormGroup.valid) {
      this.authService.createUser({
        name: (this.createUserFormGroup.get('nameCtrl').value as string).trim().toUpperCase(),
        email: (this.createUserFormGroup.get('emailCtrl').value as string).trim().toLowerCase(),
        phone: (this.createUserFormGroup.get('phoneCtrl').value as string).trim(),
        cpf: (this.createUserFormGroup.get('cpfCtrl').value as string).trim(),
      }, this.createUserFormGroup.get('passwordCtrl').value).then(res => {
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

}
