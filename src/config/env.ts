import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(1).default('test-secret-key'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  AUTH_EMAIL: z.string().default('admin@smartnew.com'),
  AUTH_PASSWORD: z.string().default('smartnew2024'),
  AUTH_CLIENT_ID: z.coerce.number().int().positive().default(405),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
