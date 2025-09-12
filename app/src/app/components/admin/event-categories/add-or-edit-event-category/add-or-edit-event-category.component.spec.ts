import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditEventCategoryComponent } from './add-or-edit-event-category.component';

describe('AddOrEditEventCategoryComponent', () => {
  let component: AddOrEditEventCategoryComponent;
  let fixture: ComponentFixture<AddOrEditEventCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditEventCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrEditEventCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
