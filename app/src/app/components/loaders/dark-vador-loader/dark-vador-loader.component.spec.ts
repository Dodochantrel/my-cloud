import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkVadorLoaderComponent } from './dark-vador-loader.component';

describe('DarkVadorLoaderComponent', () => {
  let component: DarkVadorLoaderComponent;
  let fixture: ComponentFixture<DarkVadorLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkVadorLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkVadorLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
