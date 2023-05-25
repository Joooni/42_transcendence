import { Test, TestingModule } from '@nestjs/testing';
import { TwoFAService } from './twoFA.service';

describe('TwoFAService', () => {
  let service: TwoFAService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwoFAService],
    }).compile();

    service = module.get<TwoFAService>(TwoFAService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
