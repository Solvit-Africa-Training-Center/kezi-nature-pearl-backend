import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  send_grid_api: process.env.SENDGRID_API_KEY,
  from: process.env.MAIL_FROM,
}));
