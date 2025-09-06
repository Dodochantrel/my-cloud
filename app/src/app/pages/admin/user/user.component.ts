import { Component } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../class/user';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FooterTableComponent, SizeType } from '../../../components/footer-table/footer-table.component';

@Component({
  selector: 'app-user',
  imports: [CommonModule, InputTextModule, IconFieldModule, InputIconModule, FormsModule, TableModule, ButtonModule, FooterTableComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  constructor(
    private readonly notificationService: NotificationService,
    protected readonly userService: UserService,
  ) {}

  public selectedSize: SizeType = undefined;

  confirmAuthorize(user: User, event: any): void {
    this.notificationService.confirm(
      event,
      'Êtes-vous sûr de vouloir valider cet utilisateur ?',
      `Souhaitez-vous accepter cet utilisateur afin qu'il puisse accèder a l'application ?`,
      () => {
        this.authorize(user);
      },
      () => {},
      'Valider'
    )
  }

  authorize(user: User): void {
    this.userService.switchAuthorize(user).subscribe({
      next: (updatedUser) => {
        this.notificationService.showSuccess(
          'Utilisateur validé avec succès',
          `L'utilisateur ${updatedUser.firstName} est désormais autorisé.`
        );
        const updatedUsers = [...this.userService.users()];
        const index = updatedUsers.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          updatedUsers[index] = updatedUser;
        }
        this.userService.users()[index] = updatedUser;
      },
      error: (err) => {
        this.notificationService.showError('Une erreur est survenue', 'Impossible de valider cet utilisateur.');
      }
    });
  }
}
