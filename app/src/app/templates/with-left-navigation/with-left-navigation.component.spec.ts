import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithLeftNavigationComponent } from './with-left-navigation.component';

describe('WithLeftNavigationComponent', () => {
  let component: WithLeftNavigationComponent;
  let fixture: ComponentFixture<WithLeftNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithLeftNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithLeftNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
