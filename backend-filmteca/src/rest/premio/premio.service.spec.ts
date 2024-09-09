import { Test, TestingModule } from '@nestjs/testing';
import { PremioService } from './premio.service';

describe('PremioService', () => {
  let service: PremioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PremioService],
    }).compile();

    service = module.get<PremioService>(PremioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
