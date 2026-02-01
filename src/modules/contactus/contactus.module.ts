import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contactus.entity';
import { ContactusController } from './contactus.controller';
import { ContactusService } from './contactus.service';
@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [ContactusController],
  providers: [ContactusService],
})
export class ContactusModule {}
