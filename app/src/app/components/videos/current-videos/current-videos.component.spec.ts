import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentVideosComponent } from './current-videos.component';

describe('CurrentVideosComponent', () => {
  let component: CurrentVideosComponent;
  let fixture: ComponentFixture<CurrentVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentVideosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
