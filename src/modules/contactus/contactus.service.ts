import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contactus.entity';
import { CreateContactUsDto } from './dto/create-contactus.dto';
import { UpdateContactusDto } from './dto/update-contactus.dto';

@Injectable()
export class ContactusService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  async create(createContactusDto: CreateContactUsDto): Promise<Contact> {
    return this.contactRepo.save(createContactusDto);
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepo.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  async findAll(): Promise<Contact[]> {
   
    return this.contactRepo.find();}
  async update(id: string, dto: UpdateContactusDto): Promise<Contact> {
    const contact = await this.contactRepo.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    const updated = this.contactRepo.merge(contact, dto);
    return this.contactRepo.save(updated);
  }

  async remove(id: number) {
    const result = await this.contactRepo.softDelete(id);
    if (result.affected === 0) {
      return { message: 'Contact not found or already deleted' };
    }
    return { message: 'Contact deleted successfully', id };
  }
}
