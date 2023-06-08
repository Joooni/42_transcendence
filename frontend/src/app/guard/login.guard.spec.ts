import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { LoginGuard } from './login.guard';

describe('LoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => LoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
