import { registerAs } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default registerAs(
  'mail',
  (): SMTPTransport.Options => ({
    host: process.env.MAIL_HOST!,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: process.env.MAIL_USER!,
      pass: process.env.MAIL_PASS!,
    },
    tls: {
      rejectUnauthorized: false,
    },
  }),
);
