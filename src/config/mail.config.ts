import { registerAs } from '@nestjs/config';

// export default registerAs(
//   'mail',
//   (): SMTPTransport.Options => ({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.MAIL_USER!,
//       pass: process.env.MAIL_PASS!,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   }),
// );

export default registerAs('mail', () => ({
  send_grid_api: process.env.SENDGRID_API_KEY,
  from: process.env.MAIL_FROM,
}));
