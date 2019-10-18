import { Test, TestingModule } from '@nestjs/testing';
import { DyanmicTestService } from './dyanmic-test.service';

describe('DyanmicTestService', () => {
  let service: DyanmicTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DyanmicTestService],
    }).compile();

    service = module.get<DyanmicTestService>(DyanmicTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
