import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;

  isForgotPassword = false;

  constructor(
    private authSevice: AuthService,
    private router: Router
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
    this.authSevice.login(this.loginFormGroup.controls['email'].value.trim().toLowerCase(), this.loginFormGroup.controls['password'].value).then(() => {
      this.router.navigate(['/minha-conta']);
    }).catch(err => {
      console.error(err);
    });
  }

}
