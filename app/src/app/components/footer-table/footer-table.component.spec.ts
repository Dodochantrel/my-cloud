import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterTableComponent } from './footer-table.component';

describe('FooterComponent', () => {
  let component: FooterTableComponent;
  let fixture: ComponentFixture<FooterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
