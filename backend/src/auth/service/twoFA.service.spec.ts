import { Test, TestingModule } from '@nestjs/testing';
import { 2faService } from './2fa.service';

describe('2faService', () => {
  let service: 2faService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [2faService],
    }).compile();

    service = module.get<2faService>(2faService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
