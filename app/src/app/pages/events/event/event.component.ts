import { Component } from '@angular/core';
import { CalendarComponent } from '../../../components/events/calendar/calendar.component';

@Component({
  selector: 'app-event',
  imports: [CalendarComponent],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {

}
