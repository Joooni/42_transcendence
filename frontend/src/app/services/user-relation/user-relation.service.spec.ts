import { TestBed } from '@angular/core/testing';

import { UserRelationService } from './user-relation.service';

describe('UserRelationService', () => {
  let service: UserRelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRelationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
