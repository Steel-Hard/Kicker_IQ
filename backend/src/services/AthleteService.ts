import { pool } from "../database/CloudDB";

export class AthleteService {
  async getAllAthletes() {
    const result = await pool.query(`
      SELECT DISTINCT "Athlete ID"
      FROM public.players
    `);

    return result.rows;
  }

  async getAthleteById(id: number) {
    const result = await pool.query(
      `
      SELECT *
      FROM public.players
      WHERE "Athlete ID" = $1
      LIMIT 1
      `,
      [id]
    );

    return result.rows;
  }
}