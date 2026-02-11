import { Module } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUs } from './entities/contact-us.entity';
import { UserModule } from '../user/user.module';
import { MailService } from 'src/util';

@Module({
  imports: [TypeOrmModule.forFeature([ContactUs]), UserModule],
  controllers: [ContactUsController],
  providers: [ContactUsService, MailService],
})
export class ContactUsModule {}
