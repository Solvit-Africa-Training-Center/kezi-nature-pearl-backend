import { Test, TestingModule } from '@nestjs/testing';
import { ContactusController } from './contactus.controller';
import { ContactusService } from './contactus.service';

describe('ContactusController', () => {
  let controller: ContactusController;
  let service: jest.Mocked<ContactusService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactusController],
      providers: [
        {
          provide: ContactusService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContactusController>(ContactusController);
    service = module.get(ContactusService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a contact message', async () => {
    const dto = { name: 'John', phone_number: '1234567890', message: 'Hello' };
    const result = { id: '1', ...dto };

    service.create.mockResolvedValue(result as any);

    const response = await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(response).toEqual(result);
  });

  it('should find one contact message', async () => {
    const id = '1';
    const result = { id, message: 'Hello' };

    service.findOne.mockResolvedValue(result as any);

    const response = await controller.findOne(id);

    expect(service.findOne).toHaveBeenCalledWith(id);
    expect(response).toEqual(result);
  });
 
});
