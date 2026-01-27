import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  port: process.env.PORT || 3000,
  prefix: process.env.PREFIX || 'api/v1',
  origin: process.env.FRONTEND_SOURCE,
}));
