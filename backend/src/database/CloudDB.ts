import { Pool } from 'pg';

const connectionString = process.env.VERCEL_DATABASE_URL;

if (!connectionString) {
	throw new Error('Missing environment variable DATABASE_URL for Postgres connection');
}

export const pool = new Pool({
	connectionString,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);