import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Group } from '../../../class/group';
import { GroupService } from '../../../services/group.service';
import { NotificationService } from '../../../services/notification.service';
import { BrowserService } from '../../../services/browser.service';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { UserService } from '../../../services/user.service';
import { User } from '../../../class/user';
import { updateFailedInputs } from '../../../tools/update-failed-inputs';

@Component({
  selector: 'app-manage-group-users',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    AutoCompleteModule,
  ],
  templateUrl: './manage-group-users.component.html',
  styleUrl: './manage-group-users.component.css',
})
export class ManageGroupUsersComponent {
  private formBuilder = inject(FormBuilder);

  public users: User[] = [];
  public usersToDisplay: User[] = [];

  constructor(
    protected readonly groupService: GroupService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {
    effect(() => {
      if (!this.groupService.isManagingGroupUsers()) {
        this.getUsers();
      }
    });
  }

  public form = this.formBuilder.group<{
    user: FormControl<User | null>;
  }>({
    user: new FormControl<User | null>(null, Validators.required),
  });

  getUsers() {
    this.userService.getMinimalData().subscribe({
      next: (response) => {
        this.users = response;
        this.usersToDisplay = this.users;
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur lors de la récupération des utilisateurs',
          error.message
        );
      },
    });
  }

  searchAutocompleteUser(event: any) {
    this.usersToDisplay = this.users.filter((user) => {
      // Filtrer également les utilisateurs déjà présents dans le groupe
      if (this.groupService.managingUsersGroup() && this.groupService.managingUsersGroup()!.users) {
        const userAlreadyInGroup = this.groupService.managingUsersGroup()!.users.find(
          (groupUser) => groupUser.id === user.id
        );
        if (userAlreadyInGroup) {
          return false;
        }
      }
      return user.email.toLowerCase().includes(event.query.toLowerCase());
    });
  }

  addUserToGroup() {
    if (this.form.valid && this.groupService.managingUsersGroup()) {
      this.groupService.addUser(this.groupService.managingUsersGroup()!.id, this.form.value.user!.id);
    } else {
      updateFailedInputs(this.form);
      this.notificationService.showError(
        "Erreur lors de l'ajout de l'utilisateur au groupe",
        'Veuillez vérifier les champs du formulaire'
      );
    }
  }

  removeUserFromGroup(user: User) {
    if (this.groupService.managingUsersGroup()) {
      this.groupService.removeUser(this.groupService.managingUsersGroup()!.id, user.id)
    }
  }

  cancelAddUserToGroup() {
    this.groupService.isManagingGroupUsers.set(false);
    this.form.reset();
  }
}
