import { Test, TestingModule } from '@nestjs/testing';
import { DyanmicTestController } from './dyanmic-test.controller';

describe('DyanmicTest Controller', () => {
  let controller: DyanmicTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DyanmicTestController],
    }).compile();

    controller = module.get<DyanmicTestController>(DyanmicTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
