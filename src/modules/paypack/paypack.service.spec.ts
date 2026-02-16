import { Test, TestingModule } from '@nestjs/testing';
import { PaypackService } from './paypack.service';

describe('PaypackService', () => {
  let service: PaypackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaypackService],
    }).compile();

    service = module.get<PaypackService>(PaypackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
