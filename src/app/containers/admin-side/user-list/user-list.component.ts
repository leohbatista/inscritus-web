import { Component, OnInit } from '@angular/core';
import { AdminUsersService } from 'src/app/services/admin-users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  readonly filterFields = [
    {
      name: 'name',
      label: 'Nome'
    },
    {
      name: 'email',
      label: 'E-mail'
    },
    {
      name: 'cpf',
      label: 'CPF'
    },
    {
      name: 'type',
      label: 'Tipo'
    }
  ];

  displayedColumns: string[] = ['name', 'email', 'cpf', 'type', 'actions'];
  usersDataSource = [];

  // Filter
  selectedFilter = this.filterFields[0];
  filterValue = '';

  isLoading = true;

  constructor(
    private adminUser: AdminUsersService,
  ) { }

  ngOnInit(): void {
    this.adminUser.searchUsers().then(users => {
      this.usersDataSource = users;
    }).catch(err => {
      console.error('Cannot get users');
    }).finally(() => {
      this.isLoading = false;
    })
  }

}
