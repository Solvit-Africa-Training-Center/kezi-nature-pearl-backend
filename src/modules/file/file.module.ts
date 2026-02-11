import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { Cloudinary } from './cloudinary';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [FileService, Cloudinary],
  exports: [FileService],
})
export class FileModule {}
