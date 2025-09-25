import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeenVideosComponent } from './seen-videos.component';

describe('SeenVideosComponent', () => {
  let component: SeenVideosComponent;
  let fixture: ComponentFixture<SeenVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeenVideosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeenVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
