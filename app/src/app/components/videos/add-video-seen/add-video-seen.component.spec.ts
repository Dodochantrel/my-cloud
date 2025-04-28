import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideoSeenComponent } from './add-video-seen.component';

describe('AddVideoSeenComponent', () => {
  let component: AddVideoSeenComponent;
  let fixture: ComponentFixture<AddVideoSeenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVideoSeenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVideoSeenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
