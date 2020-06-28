import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { firestore, User } from 'firebase';
import { MatTableDataSource } from '@angular/material/table';

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

  readonly userTypes = [
    {
      name: 'common-user',
      label: 'Participante',
    },
    {
      name: 'admin',
      label: 'Admin',
    },
  ]

  displayedColumns: string[] = ['name', 'email', 'cpf', 'status', 'type', 'actions'];
  usersDataSource: MatTableDataSource<User>;

  // Filter
  selectedFilter = this.filterFields[0];
  filterValue = '';
  currentFilterValue = '';

  // Pagination
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50];
  currentPage = 0;

  // Sorting
  sortField = 'name';
  sortDirection: firestore.OrderByDirection = 'desc';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  isLoading = true;

  constructor(
    private adminUsersService: AdminUsersService,
  ) { }

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    this.isLoading = true;

    this.adminUsersService.searchUsers({
      filterField: this.selectedFilter.name,
      filterValue: this.filterValue,
      orderField: this.sortField,
      orderDirection: this.sortDirection,
      pageSize: this.pageSize,
      page: this.currentPage,
    }).then(users => {
      this.length = users.total;
      this.usersDataSource = new MatTableDataSource(users.results);
      this.usersDataSource.paginator = this.paginator;
      this.usersDataSource.sort = this.sort;
    }).catch(err => {
      console.error('Cannot get users');
    }).finally(() => {
      this.isLoading = false;
    })
  }

  setPageSizeOptions(setPageSizeOptionsInput: string): void {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  paginatorEvent(event: PageEvent): void {
    if(event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
      this.currentPage = 0;
    } else {
      this.currentPage = event.pageIndex;
      console.log(this.currentPage, this.pageSize);
    }
    this.applyFilter();
  }

  sortData(event: Sort): void {
    this.sortDirection = (event.direction || 'asc');
    this.sortField = event.active;
    this.currentPage = 0;
    this.applyFilter();
  }

  clearFilter(): void {
    this.currentFilterValue = '';
    this.filterValue = '';
    this.currentPage = 0;
    this.applyFilter(); 
  }

}
