import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { UploadApiResponse, v2 } from 'cloudinary';
import fs from 'fs';
import { FileType } from 'src/common/enums/product.enum';
import { url } from 'inspector';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}

  async uploadFile(file: {
    path: string;
    filename: string;
  }): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const { path: filePath, filename } = file;

      v2.uploader.upload(
        filePath,
        {
          folder: 'kezi',
          public_id: filename,
          resource_type: 'auto',
          overwrite: false,
        },
        (error, result) => {
          if (error) return reject(error);

          if (!result)
            return reject(
              new NotImplementedException('Cloudinary upload failed'),
            );
          resolve(result);
        },
      );
    });
  }

  async save(file: Express.Multer.File, fileType: FileType) {
    const res = await this.uploadFile(file);

    const newFile = await this.fileRepo.save({
      url: res.url,
      name: res.public_id,
      type: fileType,
      mimeType: res.type,
      size: res.bytes,
    });

    if (file.path) {
      fs.unlink(file.path, (err) => {
        if (err) console.error('Failed to delete temp file: ', err);
      });
    }

    return newFile;
  }

  deleteFile(url: string, resourceType: string): Promise<void> {
    return new Promise((resolve, reject) => {
      void v2.uploader.destroy(
        url,
        { resource_type: resourceType },
        (error, result) => {
          if (error) return reject(error);

          if (result?.result !== 'ok') {
            return reject(
              new Error(`Cloudinary delete failed: ${result?.result}`),
            );
          }

          resolve();
        },
      );
    });
  }

  async findOne(id: string) {
    return await this.fileRepo.findOne({ where: { id } });
  }

  async remove(id: string) {
    const file = await this.findOne(id);
    if (!file) throw new NotFoundException('File not found');

    console.log('Delete file');

    this.deleteFile(file.name, file.type);
    this.fileRepo.delete(id);
  }

  findAll() {
    return `This action returns all file`;
  }
}
