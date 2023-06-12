import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFAComponent } from './two-fa.component';

describe('TwoFAComponent', () => {
  let component: TwoFAComponent;
  let fixture: ComponentFixture<TwoFAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoFAComponent]
    });
    fixture = TestBed.createComponent(TwoFAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
