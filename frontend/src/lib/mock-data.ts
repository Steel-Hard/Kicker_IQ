export type AthleteProfile = 'explosivo' | 'impacto' | 'resist' | 'baixa'

export interface MatchRecord {
  jornada: string
  sprintDist: number
  maxSpeed: number
  carga: number
  pse: number
}

export interface Athlete {
  id: string
  name: string
  initials: string
  number: number
  position: string
  group?: string
  profile: AthleteProfile
  profileLabel: string
  age: number
  speed: number
  sprintDistance: number
  weeklyLoad: number
  pse: number
  speedDelta: number
  sprintDelta: number
  loadDelta: number
  pseDelta: number
  hasAlert: boolean
  alertTitle?: string
  alertDesc?: string
  radar: {
    velocidade: number
    resistencia: number
    explosividade: number
    carga: number
    recuperacao: number
    tecnica: number
  }
  matchHistory: MatchRecord[]
  metrics?: {
    distanceM: number
    metresPerMinuteM: number
    highIntensityRunningM: number
    noHighIntensityEvents: number
    noSprints: number
    rawTopSpeedKph: number
    topSpeedKph: number
    avgSpeedKph: number
    accelerations: number
    decelerations: number
    durationMins: number
    workloadIntensity: number | null
    pctMaxSpeed: number | null
    pctRawMaxSpeedKph: number | null
  }
  clusterScores?: {
    resistente: number;
    explosivo: number;
    baixo_volume: number;
    moderado: number;
  }
}

export const teamStats = {
  avgSpeed: 29.1,
  avgSprintDist: 591,
  avgLoad: 2531,
  avgPse: 7.2,
  speedDelta: 3.4,
  sprintDelta: 2.8,
  loadDelta: 5.1,
  pseDelta: 4.2,
  alertCount: 2,
  lastMatch: {
    date: '28 Abr 2026',
    competition: 'Campeonato Brasileiro — Série A',
    result: 'Vitória',
    score: '2–1',
    opponent: 'Fluminense',
    jornada: 'J22',
  },
  sprintHistory: [
    { jornada: 'J19', dist: 560, alert: false },
    { jornada: 'J20', dist: 578, alert: false },
    { jornada: 'J21', dist: 572, alert: false },
    { jornada: 'J22', dist: 591, alert: true },
  ],
}
