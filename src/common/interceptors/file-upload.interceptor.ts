import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  constructor(
    private readonly fieldName: string,
    private readonly maxCount?: number,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const storage = diskStorage({
      destination: './uploads',
      filename: (_, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${randomUUID()}${ext}`);
      },
    });

    const upload = multer({ storage }).single(this.fieldName);
    return new Promise((resolve, reject) => {
      upload(req, res, (err: any) => {
        if (err) {
          return reject(
            new BadRequestException(`File Upload failed: ${err.message}`),
          );
        }
        resolve(next.handle());
      });
    }) as unknown as Observable<any>;
  }
}
