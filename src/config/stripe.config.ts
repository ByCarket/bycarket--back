import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({
  path: '.env.development',
});

export default registerAs('stripe', () => ({
  secretKey: process.env.STRIPE_SECRET_KEY,
}));
