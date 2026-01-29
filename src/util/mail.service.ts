import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly apiKey: string;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = String(this.configService.get<string>('mail.send_grid_api'));
    this.from = String(this.configService.get<string>('mail.from'));

    if (!this.apiKey) {
      throw new Error('SendGrid API key is missing');
    }

    sgMail.setApiKey(this.apiKey);
  }

  async sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    console.log('from: ', this.from);
    try {
      await sgMail.send({
        to: options.to,
        from: this.from,
        subject: options.subject,
        text: options.to ?? '',
        html: options.html,
      });
    } catch (error) {
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
}
