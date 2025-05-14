import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsOfDateComponent } from './events-of-date.component';

describe('EventsOfDateComponent', () => {
  let component: EventsOfDateComponent;
  let fixture: ComponentFixture<EventsOfDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsOfDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsOfDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
