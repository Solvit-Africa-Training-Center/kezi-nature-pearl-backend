import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  swagger_user: String(process.env.SWAGGER_USER),
  swagger_pass: String(process.env.SWAGGER_PASSWORD),
}));
