import { TestBed } from '@angular/core/testing';

import { GameDisplayService } from './game-display.service';

describe('GameDisplayService', () => {
  let service: GameDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
