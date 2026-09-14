import { betterAuth } from 'better-auth';
import { getDb } from './db';

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() || '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || '';

export const auth = betterAuth({
  database: getDb(),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET || 'cinemahd_super_secret_auth_key_2026_x89f',
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: googleClientId || 'unconfigured_google_client_id',
      clientSecret: googleClientSecret || 'unconfigured_google_client_secret',
      enabled: Boolean(googleClientId && googleClientSecret),
    },
  },
  user: {
    additionalFields: {
      image: {
        type: 'string',
        required: false,
      },
    },
  },
});
