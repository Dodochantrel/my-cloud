import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../services/group.service';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';
import { Paginated } from '../../../class/paginated';
import { Group } from '../../../class/group';
import {
  defaultPaginatedMeta,
  PaginatedMeta,
} from '../../../class/paginated-meta';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FooterTableComponent } from '../../../components/footer-table/footer-table.component';

@Component({
  selector: 'app-group',
  imports: [
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    AutoCompleteModule,
    FormsModule,
    FooterTableComponent,
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupComponent implements OnInit {
  constructor(
    private readonly recipeService: GroupService,
    private readonly browserService: BrowserService,
    private readonly notificationService: NotificationService
  ) {}

  public isLoadingData: boolean = false;
  public groupsToSearch: Group[] = [];
  public search: string = '';
  public isDisplayedUsers: boolean = false;

  public paginatedGroups: Paginated<Group> = new Paginated<Group>(
    [],
    defaultPaginatedMeta
  );

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getGroups();
    }
  }

  handleIsDisplayedUsers(): void {
    this.isDisplayedUsers = !this.isDisplayedUsers;
  }

  pageChanged(page: number, limit: number): void {
    this.paginatedGroups.paginatedMeta.page = page;
    this.paginatedGroups.paginatedMeta.limit = limit;
    this.getGroups();
  }

  getGroups(): void {
    this.isLoadingData = true;
    this.recipeService
      .getAll(
        this.search,
        this.paginatedGroups.paginatedMeta.page,
        this.paginatedGroups.paginatedMeta.limit
      )
      .subscribe({
        next: (response: Paginated<Group>) => {
          this.paginatedGroups = response;
        },
        error: (error) => {
          this.notificationService.showError(
            'Erreur lors de la récupération des groupes',
            error.message
          );
        },
        complete: () => {
          this.isLoadingData = false;
        },
      });
  }
}
