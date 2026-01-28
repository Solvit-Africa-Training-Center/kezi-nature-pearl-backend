import { Entity } from 'typeorm';

@Entity('files')
export class File {
  fileId: string;
  url: string;
  type: string;
  createdAt: Date;
}
