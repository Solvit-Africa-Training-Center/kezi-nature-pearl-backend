import { Test, TestingModule } from '@nestjs/testing';
import { PaypackController } from './paypack.controller';
import { PaypackService } from './paypack.service';

describe('PaypackController', () => {
  let controller: PaypackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaypackController],
      providers: [PaypackService],
    }).compile();

    controller = module.get<PaypackController>(PaypackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
