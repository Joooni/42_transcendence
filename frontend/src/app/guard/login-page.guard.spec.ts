import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginPageGuard } from './login-page.guard';

describe('loginPageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginPageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
