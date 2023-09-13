import { Test, TestingModule } from '@nestjs/testing';
import { ChannelMuteService } from './channel-mute.service';

describe('ChannelMuteService', () => {
  let service: ChannelMuteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelMuteService],
    }).compile();

    service = module.get<ChannelMuteService>(ChannelMuteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
