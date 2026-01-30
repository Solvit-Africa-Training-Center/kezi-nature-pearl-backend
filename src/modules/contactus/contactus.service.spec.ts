import { Test, TestingModule } from '@nestjs/testing';
import { ContactusService } from './contactus.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contact } from './entities/contactus.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ContactusService', () => {
  let service: ContactusService;
  let repo: jest.Mocked<Repository<Contact>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactusService,
        {
          provide: getRepositoryToken(Contact),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            merge: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContactusService>(ContactusService);
    repo = module.get(getRepositoryToken(Contact));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new contact', async () => {
    const dto = { name: 'John', email: 'a@test.com', message: 'Hello' };
    const saved = { id: '1', ...dto };

    repo.save.mockResolvedValue(saved as any);

    const result = await service.create(dto as any);

    expect(repo.save).toHaveBeenCalledWith(dto);
    expect(result).toEqual(saved);
  });

  it('should return a contact by id', async () => {
    const contact = { id: '1', name: 'John' };
    repo.findOne.mockResolvedValue(contact as any);

    const result = await service.findOne('1');

    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toEqual(contact);
  });

  it('should throw NotFoundException if contact not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
  });

  
  
});
