import { pool } from '../database/CloudDB';

export class AthleteService {
  async getAllAthletes() {
    const result = await pool.query(`
      SELECT DISTINCT ON ("Athlete ID") *
      FROM public.players
      ORDER BY "Athlete ID"
    `);

    return result.rows;
  }

  async getAthleteById(id: number) {
    const result = await pool.query(
      `
      SELECT *
      FROM public.players
      WHERE "Athlete ID" = $1
      ORDER BY "Start Date" DESC, "Start Time" DESC
      LIMIT 1
      `,
      [id],
    );

    return result.rows;
  }

  async getAthletesByDate(date: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM public.players
      WHERE "Start Date"::date = $1
      `,
      [date],
    );
    return result.rows;
  }

  async importData(records: any[]) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const record of records) {
        await client.query(
          `
          INSERT INTO public.players (
            "Athlete ID", "Name", "Position", "Groups", "Top Speed", "Sprint Distance",
            "Start Date", "Start Time", "Duration (mins)", "Distance (m)", "Avg Speed (kph)"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT ("Athlete ID") DO UPDATE SET
            "Name" = EXCLUDED."Name",
            "Position" = EXCLUDED."Position",
            "Groups" = EXCLUDED."Groups",
            "Top Speed" = EXCLUDED."Top Speed",
            "Sprint Distance" = EXCLUDED."Sprint Distance",
            "Start Date" = EXCLUDED."Start Date",
            "Start Time" = EXCLUDED."Start Time"
        `,
          [
            record['Athlete ID'],
            record['Name'] || 'Atleta ' + record['Athlete ID'],
            record['Athlete Position'] || record['Position'],
            record['Athlete Groups'] || record['Groups'],
            record['Top Speed (kph)'] || record['Top Speed'],
            record['Sprint Distance (m)'] || record['Sprint Distance'],
            record['Start Date'],
            record['Start Time'],
            record['Duration (mins)'],
            record['Distance (m)'],
            record['Avg Speed (kph)'],
          ],
        );
      }

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
