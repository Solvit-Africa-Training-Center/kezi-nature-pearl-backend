import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContactSubjectEnum } from '../entities/contact-us.entity';

export class CreateContactUsDto {
  @ApiProperty({ description: 'Name of the person submitting the message' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email address of the submitter' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    enum: ContactSubjectEnum,
    default: ContactSubjectEnum.SUPPORT,
  })
  @IsEnum(ContactSubjectEnum)
  subject: ContactSubjectEnum;

  @ApiProperty({ description: 'Content of the contact message' })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class RespondContactUsDto {
  @ApiProperty({
    example: 'Thank you for reaching out. We have resolved your issue.',
    description: 'Admin response to the contact message',
  })
  @IsString()
  @IsNotEmpty()
  response: string;
}
