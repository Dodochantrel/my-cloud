import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-valid-email',
  imports: [
    ReactiveFormsModule, 
    InputOtpModule, 
    CommonModule,
    InputIconModule,
  ],
  templateUrl: './valid-email.component.html',
  styleUrl: './valid-email.component.css'
})
export class ValidEmailComponent {
  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    code: ['', [Validators.required]],
  });
}
