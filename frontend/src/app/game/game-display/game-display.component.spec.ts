import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDisplayComponent } from './game-display.component';

describe('GameDisplayComponent', () => {
  let component: GameDisplayComponent;
  let fixture: ComponentFixture<GameDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameDisplayComponent]
    });
    fixture = TestBed.createComponent(GameDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
