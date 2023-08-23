import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameWatchComponent } from './game-watch.component';

describe('GameWatchComponent', () => {
  let component: GameWatchComponent;
  let fixture: ComponentFixture<GameWatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameWatchComponent]
    });
    fixture = TestBed.createComponent(GameWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
