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
    await sgMail.send({
      to: options.to,
      from: this.from,
      subject: options.subject,
      text: options.to ?? '',
      html: options.html,
    });
  }
}

// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';
// import * as handlebars from 'handlebars';
// import * as fs from 'fs';
// import * as path from 'path';

// @Injectable()
// export class MailService {
//   private readonly logger = new Logger(MailService.name);
//   private transporter: nodemailer.Transporter;
//   private readonly templatesPath = path.join(
//     __dirname,
//     '..',
//     '..',
//     'templates',
//     'emails',
//   );

//   constructor(private configService: ConfigService) {
//     this.transporter = nodemailer.createTransport({
//       host: this.configService.get('SMTP_HOST'),
//       port: this.configService.get('SMTP_PORT'),
//       secure: this.configService.get('SMTP_SECURE'),
//       auth: {
//         user: this.configService.get('SMTP_USER'),
//         pass: this.configService.get('SMTP_PASS'),
//       },
//     });
//   }

//   private async sendMail(
//     to: string,
//     subject: string,
//     html: string,
//   ): Promise<void> {
//     const mailOptions = {
//       from: this.configService.get('MAIL_FROM'),
//       to,
//       subject,
//       html,
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//       this.logger.log(`Email sent to ${to}`);
//     } catch (error) {
//       this.logger.error(`Failed to send email to ${to}: ${error.message}`);
//       throw error;
//     }
//   }

//   private compileTemplate(templateName: string, context: any): string {
//     const templatePath = path.join(this.templatesPath, `${templateName}.hbs`);
//     const templateSource = fs.readFileSync(templatePath, 'utf8');
//     const template = handlebars.compile(templateSource);
//     return template(context);
//   }

//   async sendWelcomeEmail(email: string, name: string): Promise<void> {
//     const html = this.compileTemplate('welcome', {
//       name,
//       supportEmail: this.configService.get('SUPPORT_EMAIL'),
//     });

//     await this.sendMail(email, 'Welcome to Our Skincare Platform!', html);
//   }

//   async sendEmailVerification(
//     email: string,
//     name: string,
//     token: string,
//   ): Promise<void> {
//     const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

//     const html = this.compileTemplate('email-verification', {
//       name,
//       verificationUrl,
//       expiryHours: 24,
//     });

//     await this.sendMail(email, 'Verify Your Email Address', html);
//   }

//   async sendPasswordResetEmail(
//     email: string,
//     name: string,
//     token: string,
//   ): Promise<void> {
//     const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

//     const html = this.compileTemplate('password-reset', {
//       name,
//       resetUrl,
//       expiryHours: 1,
//     });

//     await this.sendMail(email, 'Reset Your Password', html);
//   }

//   async sendPasswordChangedNotification(email: string): Promise<void> {
//     const html = this.compileTemplate('password-changed', {
//       supportEmail: this.configService.get('SUPPORT_EMAIL'),
//     });

//     await this.sendMail(email, 'Password Changed Successfully', html);
//   }

//   async sendPasswordResetConfirmation(email: string): Promise<void> {
//     const html = this.compileTemplate('password-reset-confirmation', {
//       supportEmail: this.configService.get('SUPPORT_EMAIL'),
//     });

//     await this.sendMail(email, 'Password Reset Successful', html);
//   }

//   async sendOrderConfirmation(
//     email: string,
//     name: string,
//     orderDetails: any,
//   ): Promise<void> {
//     const html = this.compileTemplate('order-confirmation', {
//       name,
//       order: orderDetails,
//     });

//     await this.sendMail(email, 'Order Confirmation', html);
//   }
// }
