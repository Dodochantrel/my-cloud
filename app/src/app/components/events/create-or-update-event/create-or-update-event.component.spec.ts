import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrUpdateEventComponent } from './create-or-update-event.component';

describe('CreateOrUpdateEventComponent', () => {
  let component: CreateOrUpdateEventComponent;
  let fixture: ComponentFixture<CreateOrUpdateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrUpdateEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrUpdateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
