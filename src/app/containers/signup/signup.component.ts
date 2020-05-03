import { Component, OnInit } from '@angular/core';

import { AppInfo } from "src/config/app-info";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  termsOfService = AppInfo.termsOfServiceLink;
  privacyPolicy = AppInfo.privacyPolicyLink;

  createUserFormGroup: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {    
    this.createUserFormGroup = new FormGroup({
      nameCtrl: new FormControl('', [Validators.required]),
      emailCtrl: new FormControl('', [Validators.required, Validators.email]),
      phoneCtrl: new FormControl('', [Validators.required]),
      cpfCtrl: new FormControl('', [Validators.required]),
      passwordCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]),
      confirmCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]),
      termsCtrl: new FormControl(false, [Validators.required])
    })

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
      });
    }
  }

}
