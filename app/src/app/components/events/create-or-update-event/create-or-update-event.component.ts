import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { AgendaEvent } from '../../../class/agenda-event';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AgendaEventService } from '../../../services/agenda-event.service';
import { NotificationService } from '../../../services/notification.service';
import { BrowserService } from '../../../services/browser.service';
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../class/group';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { updateFailedInputs } from '../../../tools/update-failed-inputs';
import { AgendaEventCategoryService } from '../../../services/agenda-event-category.service';
import { AgendaEventCategory } from '../../../class/agenda-event-category';

@Component({
  selector: 'app-create-or-update-event',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    MultiSelectModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ToggleSwitchModule,
    SelectModule,
    DatePickerModule,
  ],
  templateUrl: './create-or-update-event.component.html',
  styleUrl: './create-or-update-event.component.css',
})
export class CreateOrUpdateEventComponent {
  public isLoading: boolean = false;
  public myGroups: Group[] = [];

  private readonly formBuilder = inject(FormBuilder);

  constructor(
    protected readonly agendaEventService: AgendaEventService,
    private readonly notificationService: NotificationService,
    private readonly browserService: BrowserService,
    private readonly groupService: GroupService,
    protected readonly agendaEventCategoryService: AgendaEventCategoryService,
  ) {
    effect(() => {
      if (this.agendaEventService.isAddingOrUpdating()) {
        this.displayChange();
      }
    });
  }
  
  form = this.formBuilder.group({
    name: ['', Validators.required],
    typeId: [null as string | null],
    groups: [null],
    isEveryWeek: [false],
    isEveryMonth: [false],
    isEveryYear: [false],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null],
    startTime: [null as Date | null],
    endTime: [null as Date | null],
    fullDay: [true],
  });

  displayChange(): void {
    if (this.browserService.isBrowser) {
      this.getGroups();
    }

    if(this.agendaEventService.selectedDate) {
      this.form.get('startDate')?.setValue(this.agendaEventService.selectedDate);
    }

    if(this.agendaEventService.agendaEventEditing) {
      this.form.patchValue({
        name: this.agendaEventService.agendaEventEditing.name,
        typeId: this.agendaEventService.agendaEventEditing.category?.id ?? null,
        isEveryWeek: this.agendaEventService.agendaEventEditing.category ? this.agendaEventService.agendaEventEditing.category.isAutomaticallyEveryWeek : false,
        isEveryMonth: this.agendaEventService.agendaEventEditing.category ? this.agendaEventService.agendaEventEditing.category.isAutomaticallyEveryMonth : false,
        isEveryYear: this.agendaEventService.agendaEventEditing.category ? this.agendaEventService.agendaEventEditing.category.isAutomaticallyEveryYear : false,
        startDate: this.agendaEventService.agendaEventEditing.startDatetime,
        endDate: this.agendaEventService.agendaEventEditing.endDatetime,
        startTime: this.agendaEventService.agendaEventEditing.startDatetime,
        endTime: this.agendaEventService.agendaEventEditing.endDatetime,
      })
    }

    this.form.get('type')?.valueChanges.subscribe((value) => {
      this.patchBooleanValue(value);
    });

    this.form.get('fullDay')?.valueChanges.subscribe((value) => {
      if (value && value === true) {
        this.form
          .get('endDate')
          ?.setValue(new Date(this.form.get('startDate')?.value!));
      } else {
        // rendre obligatoire startTime et endTime et endDate
        this.form.get('endDate')?.setValidators([Validators.required]);
        this.form.get('endTime')?.setValidators([Validators.required]);
        this.form.get('startTime')?.setValidators([Validators.required]);
      }
    });
  }

  patchBooleanValue(agendaEventCategory: AgendaEventCategory | null) {
    if (!agendaEventCategory) return;

    this.form.patchValue({
      isEveryWeek: agendaEventCategory.isAutomaticallyEveryWeek,
      isEveryMonth: agendaEventCategory.isAutomaticallyEveryMonth,
      isEveryYear: agendaEventCategory.isAutomaticallyEveryYear,
    });
  }

  getGroups() {
    this.groupService.getAllMinimal().subscribe({
      next: (groups) => {
        this.myGroups = groups;
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur',
          "Erreur lors de la récupération des groupes d'événements"
        );
      },
    });
  }

  cancel() {
    this.form.reset({
      name: '',
      typeId: null,
      groups: null,
      isEveryWeek: false,
      isEveryMonth: false,
      isEveryYear: false,
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      fullDay: true,
    });
    this.agendaEventService.agendaEventEditing = null;
    this.agendaEventService.isAddingOrUpdating.set(false);
  }

  valid() {
    if(this.form.valid) {
      const formDates = new FormDates(
        this.form.get('startDate')?.value!,
        this.form.get('endDate')?.value ? this.form.get('endDate')?.value! : null,
        this.form.get('startTime')?.value ? this.form.get('startTime')?.value! : null,
        this.form.get('endTime')?.value ? this.form.get('endTime')?.value! : null,
        this.form.get('fullDay')?.value!
      );
      if(formDates.checkValidity()) {
        this.agendaEventService.agendaEventEditing ? this.edit(formDates) : this.save(formDates);
      } else {
        this.notificationService.showError(
          'Erreur',
          "Merci de vérifier les dates de début et de fin"
        );
      }
    } else {
      this.notificationService.showError(
        'Erreur',
        "Merci de remplir tous les champs obligatoires"
      );
      updateFailedInputs(this.form);
    }
  }

  save(formDates: FormDates) {
    this.isLoading = true;
    this.agendaEventService.create(
      this.form.get('name')?.value!,
      this.form.get('type')?.value!,
      this.form.get('isEveryWeek')?.value!,
      this.form.get('isEveryMonth')?.value!,
      this.form.get('isEveryYear')?.value!,
      formDates.startDatetime!,
      formDates.endDatetime!,
      this.form.get('groups')?.value!
    ).subscribe({
      next: (agendaEvents) => {
        this.isLoading = false;
        this.notificationService.showSuccess(
          'Succès',
          "L'événement a été créé avec succès"
        );
        this.addAgendaEvents(agendaEvents);
        this.cancel();
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError(
          'Erreur',
          "Erreur lors de la création de l'événement"
        );
      },
    })
  }

  edit(formDates: FormDates) {
    this.isLoading = true;
    this.agendaEventService.edit(
      this.agendaEventService.agendaEventEditing!.id,
      this.form.get('name')?.value!,
      this.form.get('type')?.value!,
      this.form.get('isEveryWeek')?.value!,
      this.form.get('isEveryMonth')?.value!,
      this.form.get('isEveryYear')?.value!,
      formDates.startDatetime!,
      formDates.endDatetime!,
      this.form.get('groups')?.value!
    ).subscribe({
      next: (agendaEvents) => {
        this.isLoading = false;
        this.notificationService.showSuccess(
          'Succès',
          "L'événement a été modifié avec succès"
        );
        this.agendaEventService.agendaEvents.set(
          this.agendaEventService.agendaEvents().filter(
            (event) => event.id !== this.agendaEventService.agendaEventEditing!.id
          )
        );
        this.addAgendaEvents(agendaEvents);
        this.cancel();
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError(
          'Erreur',
          "Erreur lors de la modification de l'événement"
        );
      },
    })
  }

  addAgendaEvents(agendaEvents: AgendaEvent[]): void {
    this.agendaEventService.agendaEvents.set([...this.agendaEventService.agendaEvents(), ...agendaEvents]);
  }
}

export class FormDates {
  startDatetime: Date | null;
  endDatetime: Date | null;
  startDate: Date;
  endDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  fullDay: boolean;

  constructor(
    startDate: Date,
    endDate: Date | null,
    startTime: Date | null,
    endTime: Date | null,
    fullDay: boolean
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.fullDay = fullDay;
    this.startDatetime = null;
    this.endDatetime = null;
    this.prepareDates();
  }

  prepareDates(): void {
    if (this.fullDay) {
      this.startDatetime = new Date(
        this.startDate.getFullYear(),
        this.startDate.getMonth(),
        this.startDate.getDate(),
        0,
        0,
        1
      );
      this.endDatetime = new Date(
        this.startDate.getFullYear(),
        this.startDate.getMonth(),
        this.startDate.getDate(),
        23,
        59,
        59
      );
    } else if(this.startTime && this.endTime && this.endDate) {
      this.startDatetime = new Date(
        this.startDate.getFullYear(),
        this.startDate.getMonth(),
        this.startDate.getDate(),
        this.startTime.getHours(),
        this.startTime.getMinutes()
      );
      this.endDatetime = new Date(
        this.endDate.getFullYear(),
        this.endDate.getMonth(),
        this.endDate.getDate(),
        this.endTime.getHours(),
        this.endTime.getMinutes()
      );
    }
  }

  checkValidity(): boolean {
    if (this.startDatetime && this.endDatetime) {
      return this.startDatetime.getTime() < this.endDatetime.getTime();
    }
    return false;
  }
}