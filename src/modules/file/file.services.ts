// import { Injectable, NotImplementedException } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { File, FileType } from './entities/file.entity';
// import { UploadApiResponse, v2 } from 'cloudinary';
// import fs from 'fs';

// @Injectable()
// export class FileService {
//   constructor(
//     @InjectRepository(File)
//     private readonly fileRepository: Repository<File>,
//   ) {}

//   async uploadFile(file: {
//     path: string;
//     filename: string;
//   }): Promise<UploadApiResponse> {
//     return new Promise((resolve, reject) => {
//       const { path: filePath, filename } = file;

//       v2.uploader.upload(
//         filePath,
//         {
//           folder: 'kezi',
//           public_id: filename,
//           resource_type: 'auto',
//           overwrite: false,
//         },
//         (error, result) => {
//           if (error) return reject(error);

//           if (!result)
//             return reject(
//               new NotImplementedException('Cloudinary upload failed'),
//             );
//           resolve(result);
//         },
//       );
//     });
//   }

//   async save(file: Express.Multer.File, fileType: FileType) {
//     const res = await this.uploadFile(file);

//     const newFile = await this.fileRepository.save({
//       type: fileType,
//       name: res.public_id,
//       url: res.secure_url,
//       resourceType: res.resource_type,
//     });

//     if (file.path) {
//       fs.unlink(file.path, (err) => {
//         if (err) console.error('Failed to delete temp file: ', err);
//       });
//     }

//     return newFile;
//   }

//   findAll() {
//     return `This action returns all file`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} file`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} file`;
//   }
// }
