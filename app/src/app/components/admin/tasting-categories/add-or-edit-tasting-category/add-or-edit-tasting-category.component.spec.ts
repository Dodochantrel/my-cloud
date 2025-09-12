import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditTastingCategoryComponent } from './add-or-edit-tasting-category.component';

describe('AddOrEditTastingCategoryComponent', () => {
  let component: AddOrEditTastingCategoryComponent;
  let fixture: ComponentFixture<AddOrEditTastingCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditTastingCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrEditTastingCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
