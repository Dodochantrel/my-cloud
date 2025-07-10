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
    CheckboxModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);

  constructor(private readonly notificationService: NotificationService, private readonly authService: AuthService) {}

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
      this.notificationService.showError('Erreur de validation', 'Veuillez vérifier les champs du formulaire.');
    }
  }

  login() {
    this.isLoading = true;
    this.authService.login(this.form.value.email!, this.form.value.password!, this.form.value.rememberMe!).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notificationService.showSuccess('Connexion réussie', 'Vous êtes maintenant connecté.');
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Erreur de connexion', error.message);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
