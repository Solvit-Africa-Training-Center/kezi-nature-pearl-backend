import { registerAs } from '@nestjs/config';

export default registerAs('paypack', () => ({
  key: process.env.PAYPACK_API_KEY,
  secret: process.env.PAYPACK_API_SECRET,
  url: process.env.PAYPACK_BASE_URL,
  currency: process.env.PAYPACK_CURRENCY,
}));
