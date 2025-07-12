import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TastingCategoryComponent } from './tasting-category.component';

describe('TastingCategoryComponent', () => {
  let component: TastingCategoryComponent;
  let fixture: ComponentFixture<TastingCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TastingCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TastingCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
