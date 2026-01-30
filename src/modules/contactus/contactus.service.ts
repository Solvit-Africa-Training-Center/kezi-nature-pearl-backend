import { Injectable } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contactus.dto';
import { UpdateContactusDto } from './dto/update-contactus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contactus.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';


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
   
    return this.contactRepo.find();
  }
}
