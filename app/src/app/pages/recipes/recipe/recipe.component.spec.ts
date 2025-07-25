import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterComponent } from './recipe.component';

describe('StarterComponent', () => {
  let component: StarterComponent;
  let fixture: ComponentFixture<StarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
