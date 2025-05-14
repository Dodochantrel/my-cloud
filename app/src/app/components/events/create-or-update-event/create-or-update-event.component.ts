import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
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
export class CreateOrUpdateEventComponent implements OnChanges, OnInit {
  @Input() isDisplayed: boolean = false;
  @Output() isDisplayedChange = new EventEmitter<boolean>();
  @Input() agendaEvent: AgendaEvent | null = null;
  @Output() newAgendaEvent: EventEmitter<AgendaEvent> = new EventEmitter<AgendaEvent>();

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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.browserService.isBrowser) {
      this.getTypes();
      this.getGroups();
    }
  }

  ngOnInit(): void {
    this.form.get('type')?.valueChanges.subscribe((value) => {
      this.patchBooleanValue(value);
    });

    this.form.get('fullDay')?.valueChanges.subscribe((value) => {
      if (value && value === true) {
        this.form
          .get('endDate')
          ?.setValue(new Date(this.form.get('startDate')?.value!));
        this.form.get('endTime')?.setValue(null);
        this.form.get('startTime')?.disable();
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
          "Errur lors de la récupération des groupes d'événements"
        );
      },
    });
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
    type: [null],
    groups: [null],
    isEveryWeek: [false],
    isEveryMonth: [false],
    isEveryYear: [false],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    startTime: [null as Date | null, Validators.required],
    endTime: [null as Date | null, Validators.required],
    fullDay: [true],
  });

  cancel() {
    this.form.reset();
    this.isDisplayed = false;
  }

  save() {
    console.log(this.form.value);
  }
}
