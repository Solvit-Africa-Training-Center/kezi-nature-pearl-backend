import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  port: process.env.PORT,
  prefix: process.env.PREFIX,
  origin: process.env.FRONTEND_SOURCE || `http://192.168.1.76:5173`,

  jwt_access: {
    secret: process.env.JWT_ACCESS_SECRET,
    expire: process.env.ACCESS_EXPIRY,
  },
  jwt_refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    expire: process.env.REFRESH_EXPIRY,
  },

  jwt_email_verification: {
    secret: process.env.JWT_EMAIL_VERIFICATION_SECRET,
    expire: process.env.EMAIL_VERIFICATION_EXPIRY,
  },

  jwt_password_reset: {
    secret: process.env.JWT_PASSWORD_REST_SECRET,
    expire: process.env.PASSWORD_REST_EXPIRY,
  },

  host: process.env.BACKEND_SOURCE,
}));
