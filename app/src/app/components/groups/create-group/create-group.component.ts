import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { User } from '../../../class/user';
import { NotificationService } from '../../../services/notification.service';
import { UserService } from '../../../services/user.service';
import { GroupService } from '../../../services/group.service';
import { updateFailedInputs } from '../../../tools/update-failed-inputs';

@Component({
  selector: 'app-create-group',
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
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css',
})
export class CreateGroupComponent {
  private readonly formBuilder = inject(FormBuilder);

  public users: User[] = [];
  public usersToDisplay: User[] = [];

  form = this.formBuilder.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    searchUser: [''],
    users: [<User[]>[]],
  });

  constructor(
    protected readonly groupService: GroupService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getUsers(changes);
  }

  getUsers(event: any) {
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
      return user.email.toLowerCase().includes(event.query.toLowerCase());
    });
  }

  onUserSelect(event: any) {
    const selectedUser: User = event.value;

    const currentUsers = this.form.get('users')!.value as User[];

    // Vérifie qu’il n’est pas déjà sélectionné
    if (!currentUsers.find((u) => u.id === selectedUser.id)) {
      const updatedUsers = [...currentUsers, selectedUser];
      this.form.get('users')!.setValue(updatedUsers);
    }

    // Réinitialise le champ de recherche
    this.form.get('searchUser')!.setValue('');
    this.users = this.users.filter((u: User) => u.id !== event.value.id);
  }

  save() {
    if (this.form.valid) {
      this.groupService
        .create(
          this.form.get('name')!.value!,
          this.form.get('users')!.value!.map((user: User) => user.id)
        );
        this.cancel();
    } else {
      this.notificationService.showError(
        'Erreur lors de la création du groupe',
        'Veuillez vérifier les champs du formulaire'
      );
      updateFailedInputs(this.form);
    }
  }

  removeUser(user: User) {
    console.log('remove' + user);
  }

  cancel() {
    this.form.reset();
    this.groupService.isCreating = false;
  }
}
