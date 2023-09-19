import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyConnectedComponent } from './already-connected.component';

describe('AlreadyConnectedComponent', () => {
  let component: AlreadyConnectedComponent;
  let fixture: ComponentFixture<AlreadyConnectedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlreadyConnectedComponent]
    });
    fixture = TestBed.createComponent(AlreadyConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
