import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { updateFailedInputs } from '../../../tools/update-failed-inputs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    PasswordModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private formBuilder = inject(FormBuilder);

  constructor(private readonly notificationService: NotificationService, private readonly authService: AuthService, private readonly router: Router) { }

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  public isLoading: boolean = false;

  submit() {
    if (this.form.valid) {
      this.register();
    } else {
      updateFailedInputs(this.form);
      this.notificationService.showError('Erreur de validation', 'Veuillez vérifier les champs du formulaire.');
    }
  }

  register() {
    this.isLoading = true;
    this.authService.register(
      this.form.value.email!,
      this.form.value.firstName!,
      this.form.value.lastName!,
      this.form.value.password!
    ).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Inscription réussie', 'Votre compte a été créé avec succès.');
        this.router.navigate(['/auth/valid-email']);
      },
      error: (error) => {
        this.notificationService.showError('Erreur d\'inscription', 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
