import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  port: process.env.PORT || 3000,
  prefix: process.env.PREFIX || 'api/v1',
  origin: process.env.FRONTEND_SOURCE,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
}));
