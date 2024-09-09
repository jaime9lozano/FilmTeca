import { Test, TestingModule } from '@nestjs/testing';
import { PremioController } from './premio.controller';
import { PremioService } from './premio.service';

describe('PremioController', () => {
  let controller: PremioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PremioController],
      providers: [PremioService],
    }).compile();

    controller = module.get<PremioController>(PremioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
