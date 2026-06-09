import { pool } from '../database/CloudDB';
import { mapToEnrichedAthlete } from '../utils/athleteMapper';

export class DashboardService {
  async getDashboardSummary() {
    const result = await pool.query(`
      SELECT DISTINCT ON ("Athlete ID") *
      FROM public.players
      ORDER BY "Athlete ID", "Start Date" DESC
    `);

    const athletes = result.rows.map(mapToEnrichedAthlete);

    // Calculate Squad Radar Avg
    const radarTotal = athletes.reduce((acc, a) => ({
      velocidade: acc.velocidade + a.radar.velocidade,
      resistencia: acc.resistencia + a.radar.resistencia,
      explosividade: acc.explosividade + a.radar.explosividade,
      carga: acc.carga + a.radar.carga,
      recuperacao: acc.recuperacao + a.radar.recuperacao,
      tecnica: acc.tecnica + a.radar.tecnica,
    }), { velocidade: 0, resistencia: 0, explosividade: 0, carga: 0, recuperacao: 0, tecnica: 0 });

    const count = athletes.length || 1;
    const squadRadarAvg = [
      { subject: 'Velocidade', A: radarTotal.velocidade / count },
      { subject: 'Resistência', A: radarTotal.resistencia / count },
      { subject: 'Explosividade', A: radarTotal.explosividade / count },
      { subject: 'Carga', A: radarTotal.carga / count },
      { subject: 'Recuperação', A: radarTotal.recuperacao / count },
      { subject: 'Técnica', A: radarTotal.tecnica / count },
      { subject: 'Intensidade', A: 75 }, // Example static/derived
      { subject: 'Volume', A: 80 }, // Example static/derived
    ];

    // Risk Data (Load vs PSE)
    const riskData = athletes.map(a => ({
      name: a.name,
      load: a.weeklyLoad,
      pse: a.pse,
      z: 10
    }));

    // Load Evolution
    const jornadas = ['J19', 'J20', 'J21', 'J22'];
    const loadEvolution = jornadas.map(j => {
      const sum = athletes.reduce((acc, a) => {
        const match = a.matchHistory.find(m => m.jornada === j);
        return acc + (match?.carga || 0);
      }, 0);
      return { jornada: j, carga: sum / count };
    });

    // Top Performers based on average of main metrics
    const topPerformers = [...athletes].map(a => {
      const score = (a.radar.velocidade + a.radar.explosividade + a.radar.resistencia) / 3;
      return { ...a, performanceScore: score };
    }).sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 3);

    // General Team Stats
    const teamStats = {
      avgSpeed: athletes.reduce((acc, a) => acc + a.speed, 0) / count,
      avgSprintDist: Math.round(athletes.reduce((acc, a) => acc + a.sprintDistance, 0) / count),
      avgLoad: Math.round(athletes.reduce((acc, a) => acc + a.weeklyLoad, 0) / count),
      avgPse: athletes.reduce((acc, a) => acc + a.pse, 0) / count,
      speedDelta: athletes.reduce((acc, a) => acc + a.speedDelta, 0) / count,
      sprintDelta: athletes.reduce((acc, a) => acc + a.sprintDelta, 0) / count,
      loadDelta: athletes.reduce((acc, a) => acc + a.loadDelta, 0) / count,
      pseDelta: athletes.reduce((acc, a) => acc + a.pseDelta, 0) / count,
      lastMatch: { date: '08 JUN 2026', jornada: 'J22', result: 'V', score: '2-0', opponent: 'Santos' },
      alertCount: athletes.filter(a => a.hasAlert).length,
      sprintHistory: loadEvolution.map(e => ({ name: e.jornada, time: e.carga }))
    };

    return {
      squadRadarAvg,
      riskData,
      loadEvolution,
      topPerformers,
      teamStats
    };
  }
}