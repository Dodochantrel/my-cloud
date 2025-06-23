import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AgendaEvent } from '../../../class/agenda-event';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AgendaEventService } from '../../../services/agenda-event.service';
import { NotificationService } from '../../../services/notification.service';
import { AgendaEventType } from '../../../class/agenda-event-type';
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
export class CreateOrUpdateEventComponent implements OnChanges {
  @Input() isDisplayed: boolean = false;
  @Output() isDisplayedChange = new EventEmitter<boolean>();
  @Input() agendaEvent: AgendaEvent | null = null;
  @Output() newAgendaEvents: EventEmitter<AgendaEvent[]> = new EventEmitter<AgendaEvent[]>();
  @Input() date: Date | null = null;
  @Input() agendaEventToEdit: AgendaEvent | null = null;
  @Output() agendaEventToEditChange = new EventEmitter<AgendaEvent | null>();

  public isCreating: boolean = false;

  public agendaEventTypes: AgendaEventType[] = [];
  public myGroups: Group[] = [];

  private readonly formBuilder = inject(FormBuilder);

  constructor(
    private readonly agendaEventService: AgendaEventService,
    private readonly notificationService: NotificationService,
    private readonly browserService: BrowserService,
    private readonly groupService: GroupService
  ) {}
  
  form = this.formBuilder.group({
    name: ['', Validators.required],
    type: [null as AgendaEventType | null],
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.browserService.isBrowser) {
      this.getTypes();
      this.getGroups();
    }

    if(this.date) {
      this.form.get('startDate')?.setValue(this.date);
    }

    if(this.agendaEventToEdit) {
      this.form.patchValue({
        name: this.agendaEventToEdit.name,
        type: this.agendaEventToEdit.type,
        isEveryWeek: this.agendaEventToEdit.type ? this.agendaEventToEdit.type.isAutomaticallyEveryWeek : false,
        isEveryMonth: this.agendaEventToEdit.type ? this.agendaEventToEdit.type.isAutomaticallyEveryMonth : false,
        isEveryYear: this.agendaEventToEdit.type ? this.agendaEventToEdit.type.isAutomaticallyEveryYear : false,
        startDate: this.agendaEventToEdit.startDatetime,
        endDate: this.agendaEventToEdit.endDatetime,
        startTime: this.agendaEventToEdit.startDatetime,
        endTime: this.agendaEventToEdit.endDatetime,
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

  patchBooleanValue(agendaEventType: AgendaEventType | null) {
    if (!agendaEventType) return;

    this.form.patchValue({
      isEveryWeek: agendaEventType.isAutomaticallyEveryWeek,
      isEveryMonth: agendaEventType.isAutomaticallyEveryMonth,
      isEveryYear: agendaEventType.isAutomaticallyEveryYear,
    });
  }

  getTypes() {
    this.agendaEventService.getAllTypes().subscribe({
      next: (types) => {
        this.agendaEventTypes = types;
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur',
          "Errur lors de la récupération des types d'événements"
        );
      },
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
      type: null,
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
    this.agendaEventToEdit = null;
    this.agendaEventToEditChange.emit(null);
    this.date = null;
    this.isDisplayedChange.emit(false);
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
          this.save(formDates);
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
    this.isCreating = true;
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
        this.isCreating = false;
        this.notificationService.showSuccess(
          'Succès',
          "L'événement a été créé avec succès"
        );
        this.newAgendaEvents.emit(agendaEvents);
        this.cancel();
      },
      error: (error) => {
        this.isCreating = false;
        this.notificationService.showError(
          'Erreur',
          "Erreur lors de la création de l'événement"
        );
      },
    })
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