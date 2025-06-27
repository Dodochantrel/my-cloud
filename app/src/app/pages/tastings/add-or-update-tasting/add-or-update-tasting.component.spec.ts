import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdateTastingComponent } from './add-or-update-tasting.component';

describe('AddOrUpdateTastingComponent', () => {
  let component: AddOrUpdateTastingComponent;
  let fixture: ComponentFixture<AddOrUpdateTastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrUpdateTastingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrUpdateTastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
