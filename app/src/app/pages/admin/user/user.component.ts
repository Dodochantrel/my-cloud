import { Component, OnInit } from '@angular/core';
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
export class UserComponent implements OnInit {
  constructor(
    private readonly notificationService: NotificationService,
    protected readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userService.refresh();
  }

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
      'Confirmer'
    )
  }

  authorize(user: User): void {
    this.userService.switchAuthorize(user);
  }
}
