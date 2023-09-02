import { TestBed } from '@angular/core/testing';

import { GameInviteService } from './game-invite.service';

describe('GameInviteService', () => {
  let service: GameInviteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameInviteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
