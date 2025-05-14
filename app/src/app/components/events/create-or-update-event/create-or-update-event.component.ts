import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AgendaEvent } from '../../../class/agenda-event';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create-or-update-event',
  imports: [
      DialogModule,
      ReactiveFormsModule,
      CommonModule,
          ButtonModule,
    ],
  templateUrl: './create-or-update-event.component.html',
  styleUrl: './create-or-update-event.component.css'
})
export class CreateOrUpdateEventComponent {
  @Input() isDisplayed: boolean = false;
  @Output() isDisplayedChange = new EventEmitter<boolean>();
  @Input() agendaEvent: AgendaEvent | null = null;
  @Output() save: EventEmitter<AgendaEvent> = new EventEmitter<AgendaEvent>();

  public isCreating: boolean = false;

  private readonly formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
      name: ['', Validators.required],
  });

  cancel() {
    this.form.reset();
    this.isDisplayed = false;
  }
}
