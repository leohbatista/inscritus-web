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
        }
      }),
      map(user => !!user?.isAdmin)
    )
  }
}