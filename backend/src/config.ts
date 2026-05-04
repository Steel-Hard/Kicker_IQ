import dotenv from 'dotenv';

dotenv.config();

const {
  CLIENT_ID,
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
  CLOUDNARY_NAME,
  MONGODB_URI,
  MODEL_SERVICE_URL,
} = process.env;

if (!CLIENT_ID && process.env.NODE_ENV === 'production') {
  throw new Error('Missing environment variables: CLIENT_ID is required in production');
}

export const config = {
  CLIENT_ID: CLIENT_ID || 'dummy-client-id',
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
  CLOUDNARY_NAME,
  MONGODB_URI,
  MODEL_SERVICE_URL: MODEL_SERVICE_URL || 'http://localhost:3001',
};
