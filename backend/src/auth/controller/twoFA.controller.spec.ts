import { Test, TestingModule } from '@nestjs/testing';
import { TwoFAController } from './twoFA.controller';

describe('2faController', () => {
  let controller: TwoFAController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwoFAController],
    }).compile();

    controller = module.get<TwoFAController>(TwoFAController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
