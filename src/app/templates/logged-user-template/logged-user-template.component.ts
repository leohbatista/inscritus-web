import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

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
  selector: 'app-logged-user-template',
  templateUrl: './logged-user-template.component.html',
  styleUrls: ['./logged-user-template.component.scss']
})
export class LoggedUserTemplateComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;

  fillerNav: NavItem[] = [
    {
      text: 'Atividades',
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

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 767px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit() {

  }
  
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  isLogged = true;
  isOpened = false
}
