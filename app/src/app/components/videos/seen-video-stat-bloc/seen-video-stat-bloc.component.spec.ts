import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeenVideoStatBlocComponent } from './seen-video-stat-bloc.component';

describe('SeenVideoStatBlocComponent', () => {
  let component: SeenVideoStatBlocComponent;
  let fixture: ComponentFixture<SeenVideoStatBlocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeenVideoStatBlocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeenVideoStatBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
