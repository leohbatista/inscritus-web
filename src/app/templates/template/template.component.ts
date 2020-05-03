import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/User';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

enum LinkType {
  'external',
  'route'
}

interface NavItem {
  text: string;
  link: string;
  linkType: LinkType;
  icon: string;
}

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class PageTemplateComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;

  fillerNav: NavItem[] = [
    {
      text: 'Minhas Atividades',
      link: '/atividades',
      linkType: LinkType.route,
      icon: 'web',
    },
    {
      text: 'Cronograma',
      link: '/cronograma',
      linkType: LinkType.route,
      icon: 'calendar_today',
    }
  ];

  user: User;
  userSubscription: Subscription;
  isLogged = true;
  isOpened = false;
  loading = true;

  @ViewChild('snav', { static: false }) snavRef: MatSidenav;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe(user => {      
      this.user = user;
      
      if(user) {
        this.isLogged = true;
      } else {
        this.isLogged = false;
        this.snavRef.close();
      }
      this.authService.redirectUser(this.router.url).then(() => this.loading = false);
    });
  }
  
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  signOut(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/']);
    }).catch(err => {
      console.error('Error logging out', err);
      
    });
  }
}
