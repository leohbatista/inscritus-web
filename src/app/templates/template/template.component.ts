import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { User } from 'functions/src/users/user.model';

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
      text: 'Mural de Avisos',
      link: '/avisos',
      linkType: LinkType.route,
      icon: 'dynamic_feed',
    },
    {
      text: 'Minhas Atividades',
      link: '/atividades',
      linkType: LinkType.route,
      icon: 'web',
    },
    {
      text: 'Palestrantes',
      link: '/palestrantes',
      linkType: LinkType.route,
      icon: 'record_voice_over',
    },
    {
      text: 'Cronograma',
      link: '/cronograma',
      linkType: LinkType.route,
      icon: 'calendar_today',
    }
  ];

  fillerNavAdmin: NavItem[] = [
    {
      text: 'Usuários',
      link: '/admin/usuarios',
      linkType: LinkType.route,
      icon: 'people',
    },
    {
      text: 'Atividades',
      link: '/admin/atividades',
      linkType: LinkType.route,
      icon: 'web',
    },
    {
      text: 'Feedbacks',
      link: '/admin/feedbacks',
      linkType: LinkType.route,
      icon: 'feedback',
    },
    {
      text: 'Cadastros Auxiliares',
      link: '/admin/cadastros-auxiliares',
      linkType: LinkType.route,
      icon: 'list_alt',
    },
  ];

  user: User;
  userSubscription: Subscription;
  isLogged = true;
  isAdmin = false;
  isOpened = false;
  isActive = true;
  loading = true;

  @ViewChild('snav', { static: false }) snavRef: MatSidenav;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.user = user;

      if(user) {
        this.isLogged = true;
        this.isAdmin = user.isAdmin;
        this.isActive = user.isActive;

        if(!this.isActive) {
          this.snavRef.close();
        }
      } else {
        this.isLogged = false;
        this.isAdmin = false;
        this.isActive = false;
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
