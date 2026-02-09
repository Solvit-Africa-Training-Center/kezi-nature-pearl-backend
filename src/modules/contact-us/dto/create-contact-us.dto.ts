import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactUsDto {
  @ApiProperty({ description: 'Name of the person submitting the message' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email address of the submitter' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number (optional)', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Subject of the contact message' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Content of the contact message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  userId?: string;
}

export class RespondContactUsDto {
  @IsString()
  response: string;
}

