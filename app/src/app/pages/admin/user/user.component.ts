import { Component, OnInit } from '@angular/core';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';
import { UserService } from '../../../services/user.service';
import { defaultPaginatedMeta } from '../../../class/paginated-meta';
import { Paginated } from '../../../class/paginated';
import { User } from '../../../class/user';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user',
  imports: [CommonModule, InputTextModule, IconFieldModule, InputIconModule, FormsModule, TableModule, ButtonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly browserService: BrowserService
  ) {}

  public isLoadingUsers: boolean = false;
  public paginatedUsers: Paginated<User> = new Paginated<User>(
    [],
    defaultPaginatedMeta
  );
  public search: string = '';

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getUsers();
    }
  }

  getUsers(): void {
    this.isLoadingUsers = true;
    this.userService
      .getAll(
        this.paginatedUsers.paginatedMeta.page,
        this.paginatedUsers.paginatedMeta.limit,
        this.search
      )
      .subscribe({
        next: (users) => {
          this.paginatedUsers = users;
        },
        error: (error) => {
          this.notificationService.showError(
            'Récupération des utilisateurs',
            'Une erreur est survenue lors de la récupération des utilisateurs.'
          );
          this.isLoadingUsers = false;
        },
        complete: () => {
          this.isLoadingUsers = false;
        },
      });
  }

  validUser(user: User): void {
    console.log('Validating user:', user);
  }
}
