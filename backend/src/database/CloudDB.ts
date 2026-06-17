import { Pool } from 'pg';
import { config } from '../config';
const connectionString =
  config.POSTGRES_URL ||
  'postgresql://user:password@postgres-db:5432/kicker_iq_model';

if (!connectionString) {
  throw new Error(
    'Missing environment variable DATABASE_URL for Postgres connection',
  );
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

// Handler for idle client errors to prevent process crash
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
