import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSeatchComponent } from './auto-seatch.component';

describe('AutoSeatchComponent', () => {
  let component: AutoSeatchComponent;
  let fixture: ComponentFixture<AutoSeatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoSeatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoSeatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
