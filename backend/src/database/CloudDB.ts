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
  ssl: false,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
