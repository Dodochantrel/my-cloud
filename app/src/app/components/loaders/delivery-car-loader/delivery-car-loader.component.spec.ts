import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryCarLoaderComponent } from './delivery-car-loader.component';

describe('DeliveryCarLoaderComponent', () => {
  let component: DeliveryCarLoaderComponent;
  let fixture: ComponentFixture<DeliveryCarLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryCarLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryCarLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
