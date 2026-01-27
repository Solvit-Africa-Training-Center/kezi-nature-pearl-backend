import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import mailConfig from 'src/config/mail.config';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;
  constructor(private readonly configService: ConfigService) {
    const mailconfig = configService.get<SMTPTransport.Options>('mail');

    if (!mailConfig) throw new Error('Mail Configuration is missing');

    this.transporter = nodemailer.createTransport(mailconfig);
  }

  async sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    await this.transporter.sendMail({
      from: 'KEZI Natural Pearl',
      ...options,
    });
  }
}
