import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { User } from 'functions/src/users/user.model';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {

  userSubscription: Subscription;
  user: User;

  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private admin: AdminUsersService,
  ) { }

  ngOnInit(): void {
    const uid = this.route.snapshot.paramMap.get('uid');

    this.userSubscription = this.admin.getUserByUID(uid).subscribe(user => {
      this.user = user;
      this.isLoading = false;
    });
  }

}
