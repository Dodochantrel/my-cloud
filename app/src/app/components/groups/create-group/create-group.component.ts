import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Group } from '../../../class/group';
import { User } from '../../../class/user';
import { NotificationService } from '../../../services/notification.service';
import { UserService } from '../../../services/user.service';
import { GroupService } from '../../../services/group.service';
import { BrowserService } from '../../../services/browser.service';
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
  @Input() isVisible: boolean = false;
  @Output() newGroup: EventEmitter<Group> = new EventEmitter<Group>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);

  public users: User[] = [];
  public usersToDisplay: User[] = [];

  public isCreating: boolean = false;

  form = this.formBuilder.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    searchUser: [''],
    users: [<User[]>[]],
  });

  constructor(
    private readonly groupService: GroupService,
    private readonly browserService: BrowserService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.browserService.isBrowser) {
      this.getUsers(changes);
    }
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
      this.isCreating = true;
      this.groupService
        .create(
          this.form.get('name')!.value!,
          this.form.get('users')!.value!.map((user: User) => user.id)
        )
        .subscribe({
          next: (response) => {
            this.notificationService.showSuccess(
              'Groupe créé avec succès',
              'Le groupe a été créé avec succès'
            );
            this.newGroup.emit(response);
            this.form.reset();
            this.close.emit();
          },
          error: (error) => {
            this.isCreating = false;
            this.notificationService.showError(
              'Erreur lors de la création du groupe',
              error.message
            );
          },
          complete: () => {
            this.isCreating = false;
          },
        });
    } else {
      this.notificationService.showError(
        'Erreur lors de la création du groupe',
        'Veuillez vérifier les champs du formulaire'
      );
      updateFailedInputs(this.form);
    }
  }

  removeUser(user: User) {
    const currentUsers = this.form.get('users')!.value as User[];
    const updatedUsers = currentUsers.filter((u: User) => u.id !== user.id);
    // add user from the list
    this.users.push(user);
    this.form.get('users')!.setValue(updatedUsers);
  }

  cancel() {
    this.form.reset();
    this.close.emit();
  }
}
