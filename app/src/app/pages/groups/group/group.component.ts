import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../services/group.service';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';
import { Paginated } from '../../../class/paginated';
import { Group } from '../../../class/group';
import {
  defaultPaginatedMeta,
} from '../../../class/paginated-meta';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FooterTableComponent } from '../../../components/footer-table/footer-table.component';
import { ButtonModule } from 'primeng/button';
import { ManageGroupUsersComponent } from '../../../components/groups/manage-group-users/manage-group-users.component';
import { CreateGroupComponent } from '../../../components/groups/create-group/create-group.component';

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
    ButtonModule,
    CreateGroupComponent,
    ManageGroupUsersComponent,
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
  public displayedGroupIds: Set<number> = new Set<number>();
  public isManagingGroupUsers: boolean = false;
  public groupBeingManaged: Group | null = null;

  public isCreatingGroup: boolean = false;

  public paginatedGroups: Paginated<Group> = new Paginated<Group>(
    [],
    defaultPaginatedMeta
  );

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getGroups();
    }
  }

  manageGroupUsers(group: Group): void {
    this.groupBeingManaged = group;
    this.isManagingGroupUsers = true;
  }

  closeManageGroupUsers(): void {
    this.isManagingGroupUsers = false;
    this.groupBeingManaged = null;
  }

  toggleGroupUsers(groupId: number): void {
    if (this.displayedGroupIds.has(groupId)) {
      this.displayedGroupIds.delete(groupId);
    } else {
      this.displayedGroupIds.add(groupId);
    }
  }
  
  isGroupDisplayed(groupId: number): boolean {
    return this.displayedGroupIds.has(groupId);
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

  updatedGroupUsers(group: Group): void {
    // trouver le groupe dans la liste paginée
    const index = this.paginatedGroups.data.findIndex(
      (g) => g.id === group.id
    );
    if (index !== -1) {
      this.paginatedGroups.data[index] = group;
    }
    this.isManagingGroupUsers = false;
  }

  pushNewGroup(group: Group): void {
    this.paginatedGroups.data.unshift(group);
    this.isCreatingGroup = false;
  }

  prepareDelete(event: any, group: Group) {
    this.notificationService.confirm(
      event,
      'Suppression',
      'Voulez-vous supprimer ce groupe ?',
      () => {
        this.deleteGroup(group);
      },
      () => {
        this.notificationService.showInfo('Annulé', 'Suppression annulée');
      }
    );
  }

  deleteGroup(group: Group): void {
    this.recipeService.delete(group.id).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          'Groupe supprimé',
          `Le groupe ${group.name} a été supprimé avec succès`
        );
        this.paginatedGroups.data = this.paginatedGroups.data.filter(
          (g) => g.id !== group.id
        );
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur lors de la suppression du groupe',
          error.message
        );
      },
    });
  }
}
