import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate() {
    return this.auth.user.pipe(
      tap(user => {
        if(!user) {
          this.router.navigate(['/']);
        } else if(!user.isActive) {
          this.router.navigate(['/minha-conta']);
        }
      }),
      map(user => !!user?.isAdmin)
    )
  }
}