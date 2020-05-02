import { Component, OnInit } from '@angular/core';
import { AppInfo } from 'src/config/app-info';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  appInfo;

  constructor() { 
    this.appInfo = AppInfo;
  }

  ngOnInit(): void {
  }

}
