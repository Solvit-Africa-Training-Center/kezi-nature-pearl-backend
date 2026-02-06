import { Injectable } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { ContactUs } from './entities/contact-us.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { ContactUsStatus } from 'src/common/enums/product.enum';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private readonly contactRepo: Repository<ContactUs>,
  ) {}

  async createPublicContactMessage(
    dto: CreateContactUsDto,
  ): Promise<{ message: string }> {
    const contactMessage = this.contactRepo.create(dto);

    await this.contactRepo.save(contactMessage);

    return {
      message: 'Contact message submitted successfully',
    };
  }

  async getAllPublicMessages(
    options?: FindManyOptions<ContactUs>,
  ): Promise<ContactUs[]> {
    return this.contactRepo.find({
      ...options,
      where: { userId: IsNull() },
      order: { createdAt: 'ASC' },
    });
  }

  async getPublicMessageById(
    options: FindOneOptions<ContactUs>,
  ): Promise<ContactUs> {
    const message = await this.contactRepo.findOne({
      ...options,
    });

    if (!message) {
      throw new NotFoundException(`Public contact message  not found`);
    }

    return message;
  }

  async getAllRegisteredMessages(
    options?: FindManyOptions<ContactUs>,
  ): Promise<ContactUs[]> {
    return this.contactRepo.find({
      ...options,
      where: { userId: Not(IsNull()) },
      order: { createdAt: 'ASC' },
    });
  }

  async respondToMessage(
  id: string,
  responseText: string,
  adminUserId: string,
): Promise<{ message: string }> {
  const contact = await this.contactRepo.findOne({ where: { id } });

  if (!contact) {
    throw new NotFoundException('Contact message not found');
  }

  contact.response = responseText;

  contact.status = ContactUsStatus.RESOLVED;

  contact.respondedBy = adminUserId;
  contact.respondedAt = new Date();

  await this.contactRepo.save(contact);

  return { message: 'Contact message resolved successfully' };
}

}
