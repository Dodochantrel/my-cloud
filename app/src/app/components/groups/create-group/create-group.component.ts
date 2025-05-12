import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
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
  styleUrl: './create-group.component.css'
})
export class CreateGroupComponent {
  @Input() isVisible: boolean = false;
  @Output() newGroup: EventEmitter<Group> = new EventEmitter<Group>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  
  public users: User[] = [];
  public usersToDisplay: User[] = [];

  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    searchUser: [''],
    users: [<User[]>[], Validators.required],
  });

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
    if (!currentUsers.find(u => u.id === selectedUser.id)) {
      const updatedUsers = [...currentUsers, selectedUser];
      this.form.get('users')!.setValue(updatedUsers);
    }

    // Réinitialise le champ de recherche
    this.form.get('searchUser')!.setValue('');
  }

  save() {
    console.log(this.form.value);
  }
}
