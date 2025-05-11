import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
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
export class ManageGroupUsersComponent implements OnChanges {
  private formBuilder = inject(FormBuilder);

  @Input() group: Group | null = null;
  @Input() isManaging: boolean = false;
  @Output() groupUpdated: EventEmitter<Group> = new EventEmitter<Group>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  public users: User[] = [];
  public usersToDisplay: User[] = [];

  constructor(
    private readonly recipeService: GroupService,
    private readonly browserService: BrowserService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.browserService.isBrowser) {
      this.getUsers(changes);
    }
  }

  public form = this.formBuilder.group<{
    user: FormControl<User | null>;
  }>({
    user: new FormControl<User | null>(null, Validators.required),
  });

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
      // Filtrer également les utilisateurs déjà présents dans le groupe
      if (this.group && this.group.users) {
        const userAlreadyInGroup = this.group.users.find(
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
    if (this.form.valid && this.group) {
      this.recipeService.addUser(this.group.id, this.form.value.user!.id).subscribe({
        next: (response) => {
          this.notificationService.showSuccess(
            'Utilisateur ajouté au groupe',
            `L'utilisateur a été ajouté au groupe ${this.group?.name}`
          );
          this.groupUpdated.emit(response);
          this.close.emit();
          this.form.reset();
        },
        error: (error) => {
          this.notificationService.showError(
            "Erreur lors de l'ajout de l'utilisateur au groupe",
            error.message
          );
        },
      });
    } else {
      updateFailedInputs(this.form);
      this.notificationService.showError(
        "Erreur lors de l'ajout de l'utilisateur au groupe",
        'Veuillez vérifier les champs du formulaire'
      );
    }
  }

  removeUserFromGroup(user: User) {
    if (this.group) {
      this.recipeService.removeUser(this.group.id, user.id).subscribe({
        next: (response) => {
          this.notificationService.showSuccess(
            'Utilisateur supprimé du groupe',
            `L'utilisateur a été supprimé du groupe ${this.group?.name}`
          );
          this.groupUpdated.emit(response);
          this.close.emit();
        },
        error: (error) => {
          this.notificationService.showError(
            "Erreur lors de la suppression de l'utilisateur du groupe",
            error.message
          );
        },
      });
    }
  }

  cancelAddUserToGroup() {
    this.close.emit();
    this.form.reset();
  }
}
