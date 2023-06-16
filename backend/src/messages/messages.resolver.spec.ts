import { Test, TestingModule } from '@nestjs/testing';
import { MessagesResolver } from './messages.resolver';

describe('MessagesResolver', () => {
  let resolver: MessagesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesResolver],
    }).compile();

    resolver = module.get<MessagesResolver>(MessagesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
