import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../services/group.service';
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
    protected readonly groupService: GroupService,
    private readonly notificationService: NotificationService
  ) {}

  public isLoadingData: boolean = false;
  public groupsToSearch: Group[] = [];
  public search: string = '';
  public displayedGroupIds: Set<number> = new Set<number>();

  ngOnInit(): void {
    this.groupService.refresh();
  }

  prepareToManageUsers(group: Group) {
    this.groupService.managingUsersGroup.set(group);
    this.groupService.isManagingGroupUsers.set(true);
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
    this.groupService.delete(group.id);
  }
}
