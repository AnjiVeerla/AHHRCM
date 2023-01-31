import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OPBillingComponent } from './opbilling.component';

describe('OPBillingComponent', () => {
  let component: OPBillingComponent;
  let fixture: ComponentFixture<OPBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OPBillingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OPBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
