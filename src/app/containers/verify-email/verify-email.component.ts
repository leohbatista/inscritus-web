import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    console.log();
    
    const mode = this.route.snapshot.queryParamMap.get('mode');
    
    if(mode === 'verifyEmail') {
      const code = this.route.snapshot.queryParamMap.get('oobCode');
      const continueUrl = this.route.snapshot.queryParamMap.get('continueUrl') || '/entrar';

      this.authService.confirmEmail(code).then(() => {
        this.router.navigate([continueUrl]);
      }).catch(err => {
        console.error("Error confirming  e-mail", err);
        
        // TODO: implement dialog
        this.router.navigate(['/']);

      });
    } else {
      this.router.navigate(['/']);
    }
  }

}
