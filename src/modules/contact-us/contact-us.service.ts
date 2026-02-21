import { Injectable } from '@nestjs/common';
import { ContactUs } from './entities/contact-us.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ContactUsStatus } from 'src/common/enums/product.enum';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { MailService, setUserGuestId } from 'src/util';
import { CreateContactUsDto } from './dto/create-contact-us.dto';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private readonly contactRepo: Repository<ContactUs>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async createContactMessage(
    owner: { userId?: any; guestId?: any },
    dto: CreateContactUsDto,
  ): Promise<{ message: string }> {
    const { userId, guestId } = setUserGuestId(owner);

    console.log('GuestId ', guestId);

    if (userId) {
      const user = await this.userService.findOne({ where: { id: userId } });

      if (!user) throw new NotFoundException('User not found');

      const contactMessage = this.contactRepo.create({
        userId,
        name: user.fullName,
        email: user.email,
        subject: dto.subject,
        message: dto.message,
        status: ContactUsStatus.NEW,
      });
      await this.contactRepo.save(contactMessage);
    } else if (guestId) {
      const contactMessage = this.contactRepo.create({
        guestId,
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
        status: ContactUsStatus.NEW,
      });
      await this.contactRepo.save(contactMessage);
    }

    return {
      message: 'Contact message submitted successfully',
    };
  }

  async getAllMessages(
    options?: FindManyOptions<ContactUs>,
  ): Promise<ContactUs[]> {
    const cleanedWhere = options?.where
      ? Object.fromEntries(
          Object.entries(options.where).filter(
            ([_, value]) => value !== undefined,
          ),
        )
      : undefined;

    return this.contactRepo.find({
      ...options,
      where: cleanedWhere,
      order: { createdAt: 'ASC' },
    });
  }

  async getMessageById(options: FindOneOptions<ContactUs>): Promise<ContactUs> {
    const message = await this.contactRepo.findOne({
      ...options,
    });

    if (!message) {
      throw new NotFoundException(`Public contact message  not found`);
    }

    return message;
  }

  async respondToMessage(
    id: string,
    responseText: string,
    adminUserId: string,
  ): Promise<{ message: string }> {
    const contact = await this.contactRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!contact) {
      throw new NotFoundException('Contact message not found');
    }

    contact.response = responseText;

    contact.status = ContactUsStatus.RESOLVED;

    contact.respondedBy = adminUserId;
    contact.respondedAt = new Date();

    await this.contactRepo.save(contact);

    this.mailService.sendMail({
      subject: `RE:[${contact.message}]`,
      to: contact.email,
    });

    return { message: 'Contact message resolved successfully' };
  }
}
