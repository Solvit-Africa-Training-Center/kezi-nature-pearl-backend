import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContactUsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;


   @IsString()
  @IsNotEmpty()
  email: string;

   @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
