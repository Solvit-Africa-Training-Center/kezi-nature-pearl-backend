import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FileModule } from '../file/file.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoggerService } from '@/common/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FileModule],
  controllers: [UserController],
  providers: [UserService, LoggerService],
  exports: [UserService],
})
export class UserModule {}
