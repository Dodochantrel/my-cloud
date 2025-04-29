import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSeasonComponent } from './video-season.component';

describe('VideoSeasonComponent', () => {
  let component: VideoSeasonComponent;
  let fixture: ComponentFixture<VideoSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoSeasonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
