import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRegisteredContactUsDto {
  @ApiProperty({ description: 'Subject of the contact message' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Content of the contact message' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
