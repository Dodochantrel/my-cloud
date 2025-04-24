import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoNavigationComponent } from './no-navigation.component';

describe('NoNavigationComponent', () => {
  let component: NoNavigationComponent;
  let fixture: ComponentFixture<NoNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
