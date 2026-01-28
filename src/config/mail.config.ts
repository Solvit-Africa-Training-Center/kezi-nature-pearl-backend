import { registerAs } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default registerAs(
  'mail',
  (): SMTPTransport.Options => ({
    from: String(process.env.MAIL_FROM),
    host: String(process.env.MAIL_HOST),
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: String(process.env.MAIL_USER),
      pass: String(process.env.MAIL_PASS),
    },
  }),
);
