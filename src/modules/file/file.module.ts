import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { Cloudinary } from './cloudinary';
import { FileController } from './file.controller';

@Module({
  controllers: [FileController],
  providers: [FileService, Cloudinary],
})
export class FileModule {}
