import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditPictureCategoryComponent } from './add-or-edit-picture-category.component';

describe('AddOrEditPictureCategoryComponent', () => {
  let component: AddOrEditPictureCategoryComponent;
  let fixture: ComponentFixture<AddOrEditPictureCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditPictureCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrEditPictureCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
