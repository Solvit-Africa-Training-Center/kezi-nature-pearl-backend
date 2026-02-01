import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { FileService } from './file.service';
import { Cloudinary } from './cloudinary';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [Cloudinary, FileService],
  exports: [FileService],
})
export class FileModule {}
