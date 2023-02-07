import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglefieldComponent } from './singlefield.component';

describe('SinglefieldComponent', () => {
  let component: SinglefieldComponent;
  let fixture: ComponentFixture<SinglefieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglefieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglefieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
