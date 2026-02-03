import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  port: process.env.PORT,
  prefix: process.env.PREFIX,
  origin: process.env.FRONTEND_SOURCE || `http://localhost:${process.env.PORT}`,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  host: process.env.BACKEND_SOURCE || `http://localhost:${process.env.PORT}`,
}));
