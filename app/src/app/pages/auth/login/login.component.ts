import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { updateFailedInputs } from '../../../tools/update-failed-inputs';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { CheckboxModule } from 'primeng/checkbox';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    PasswordModule,
    RouterLink,
    CheckboxModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  public isLoading: boolean = false;

  submit() {
    if (this.form.valid) {
      this.login();
    } else {
      updateFailedInputs(this.form);
      this.notificationService.showError(
        'Erreur de validation',
        'Veuillez vérifier les champs du formulaire.'
      );
    }
  }

  login() {
    this.isLoading = true;
    this.authService
      .login(
        this.form.value.email!,
        this.form.value.password!,
        this.form.value.rememberMe!
      )
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notificationService.showSuccess(
            'Connexion réussie',
            'Vous êtes maintenant connecté.'
          );
          this.userService.getMe();
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorHandler(error.status);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  errorHandler(status: number) {
    switch (status) {
      case 401:
        this.notificationService.showError(
          "Identifiants invalides",
          'Vos identifiants sont incorrects. Veuillez réessayer.'
        );
        break;
      case 404:
        this.notificationService.showError('Utilisateur non trouvé.', 'Aucun utilisateur trouvé avec ces identifiants.');
        break;
      case 403:
        this.notificationService.showError(
          'Accès non autorisé',
          'L\'administrateur n\'a pas autorisé votre compte.'
        );
        break;
      default:
        this.notificationService.showError(
          'Erreur',
          'Une erreur inconnue est survenue.'
        );
        break;
    }
  }
}
