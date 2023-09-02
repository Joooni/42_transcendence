import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInviteComponent } from './game-invite.component';

describe('GameInviteComponent', () => {
  let component: GameInviteComponent;
  let fixture: ComponentFixture<GameInviteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameInviteComponent]
    });
    fixture = TestBed.createComponent(GameInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
