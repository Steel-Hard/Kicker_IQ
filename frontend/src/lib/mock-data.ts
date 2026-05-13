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
}

export const athletes: Athlete[] = [
  {
    id: '1',
    name: 'Gabriel Silva',
    initials: 'GS',
    number: 9,
    position: 'Atacante',
    profile: 'explosivo',
    profileLabel: 'Explosivo',
    age: 24,
    speed: 32.4,
    sprintDistance: 847,
    weeklyLoad: 2340,
    pse: 8.2,
    speedDelta: 5.2,
    sprintDelta: -3.1,
    loadDelta: 8.7,
    pseDelta: 12.0,
    hasAlert: true,
    alertTitle: 'Carga acumulada elevada',
    alertDesc: 'Gabriel registrou carga acumulada 38% acima da média das últimas 4 semanas. Considere reduzir intensidade.',
    radar: { velocidade: 92, resistencia: 68, explosividade: 94, carga: 87, recuperacao: 72, tecnica: 81 },
    matchHistory: [
      { jornada: 'J19', sprintDist: 720, maxSpeed: 30.1, carga: 2100, pse: 7.5 },
      { jornada: 'J20', sprintDist: 790, maxSpeed: 31.2, carga: 2250, pse: 8.0 },
      { jornada: 'J21', sprintDist: 810, maxSpeed: 31.8, carga: 2190, pse: 7.8 },
      { jornada: 'J22', sprintDist: 847, maxSpeed: 32.4, carga: 2340, pse: 8.2 },
    ],
  },
  {
    id: '2',
    name: 'Rafael Costa',
    initials: 'RC',
    number: 5,
    position: 'Zagueiro',
    profile: 'impacto',
    profileLabel: 'Alto impacto',
    age: 28,
    speed: 28.1,
    sprintDistance: 412,
    weeklyLoad: 2810,
    pse: 7.4,
    speedDelta: -1.4,
    sprintDelta: -5.8,
    loadDelta: 14.2,
    pseDelta: 3.0,
    hasAlert: false,
    radar: { velocidade: 64, resistencia: 82, explosividade: 58, carga: 91, recuperacao: 78, tecnica: 75 },
    matchHistory: [
      { jornada: 'J19', sprintDist: 390, maxSpeed: 27.5, carga: 2600, pse: 7.0 },
      { jornada: 'J20', sprintDist: 405, maxSpeed: 27.9, carga: 2720, pse: 7.2 },
      { jornada: 'J21', sprintDist: 398, maxSpeed: 28.0, carga: 2680, pse: 7.3 },
      { jornada: 'J22', sprintDist: 412, maxSpeed: 28.1, carga: 2810, pse: 7.4 },
    ],
  },
  {
    id: '3',
    name: 'Mateus Oliveira',
    initials: 'MO',
    number: 8,
    position: 'Volante',
    profile: 'resist',
    profileLabel: 'Alta resist.',
    age: 26,
    speed: 29.3,
    sprintDistance: 621,
    weeklyLoad: 3120,
    pse: 6.8,
    speedDelta: 2.1,
    sprintDelta: 7.4,
    loadDelta: -2.3,
    pseDelta: -5.6,
    hasAlert: false,
    radar: { velocidade: 74, resistencia: 95, explosividade: 71, carga: 89, recuperacao: 91, tecnica: 83 },
    matchHistory: [
      { jornada: 'J19', sprintDist: 580, maxSpeed: 28.8, carga: 3050, pse: 7.1 },
      { jornada: 'J20', sprintDist: 595, maxSpeed: 29.0, carga: 3080, pse: 7.0 },
      { jornada: 'J21', sprintDist: 608, maxSpeed: 29.2, carga: 3100, pse: 6.9 },
      { jornada: 'J22', sprintDist: 621, maxSpeed: 29.3, carga: 3120, pse: 6.8 },
    ],
  },
  {
    id: '4',
    name: 'Lucas Ferreira',
    initials: 'LF',
    number: 1,
    position: 'Goleiro',
    profile: 'baixa',
    profileLabel: 'Baixa intens.',
    age: 31,
    speed: 19.4,
    sprintDistance: 124,
    weeklyLoad: 1240,
    pse: 5.2,
    speedDelta: 0.8,
    sprintDelta: 3.2,
    loadDelta: -1.0,
    pseDelta: -0.5,
    hasAlert: false,
    radar: { velocidade: 38, resistencia: 55, explosividade: 42, carga: 48, recuperacao: 62, tecnica: 70 },
    matchHistory: [
      { jornada: 'J19', sprintDist: 110, maxSpeed: 18.9, carga: 1200, pse: 5.0 },
      { jornada: 'J20', sprintDist: 115, maxSpeed: 19.1, carga: 1210, pse: 5.1 },
      { jornada: 'J21', sprintDist: 120, maxSpeed: 19.2, carga: 1220, pse: 5.2 },
      { jornada: 'J22', sprintDist: 124, maxSpeed: 19.4, carga: 1240, pse: 5.2 },
    ],
  },
  {
    id: '5',
    name: 'Diego Santos',
    initials: 'DS',
    number: 2,
    position: 'Lateral Dir.',
    profile: 'explosivo',
    profileLabel: 'Explosivo',
    age: 22,
    speed: 31.7,
    sprintDistance: 734,
    weeklyLoad: 2510,
    pse: 7.9,
    speedDelta: 8.1,
    sprintDelta: 11.3,
    loadDelta: 6.2,
    pseDelta: 9.5,
    hasAlert: false,
    radar: { velocidade: 88, resistencia: 72, explosividade: 87, carga: 82, recuperacao: 76, tecnica: 77 },
    matchHistory: [
      { jornada: 'J19', sprintDist: 660, maxSpeed: 29.2, carga: 2370, pse: 7.2 },
      { jornada: 'J20', sprintDist: 685, maxSpeed: 30.1, carga: 2410, pse: 7.5 },
      { jornada: 'J21', sprintDist: 710, maxSpeed: 30.9, carga: 2450, pse: 7.6 },
      { jornada: 'J22', sprintDist: 734, maxSpeed: 31.7, carga: 2510, pse: 7.9 },
    ],
  },
  {
    id: '6',
    name: 'Bruno Almeida',
    initials: 'BA',
    number: 6,
    position: 'Meia Cen.',
    profile: 'impacto',
    profileLabel: 'Alto impacto',
    age: 29,
    speed: 27.8,
    sprintDistance: 498,
    weeklyLoad: 2960,
    pse: 8.1,
    speedDelta: -2.8,
    sprintDelta: -4.1,
    loadDelta: 18.7,
    pseDelta: 15.2,
    hasAlert: true,
    alertTitle: 'PSE elevada — 3 sessões',
    alertDesc: 'Bruno reportou PSE 8,1 por 3 sessões consecutivas. Monitorar sinais de fadiga acumulada.',
    radar: { velocidade: 62, resistencia: 79, explosividade: 65, carga: 93, recuperacao: 71, tecnica: 86 },
    matchHistory: [
      { jornada: 'J19', sprintDist: 521, maxSpeed: 28.2, carga: 2490, pse: 7.0 },
      { jornada: 'J20', sprintDist: 514, maxSpeed: 28.0, carga: 2680, pse: 7.8 },
      { jornada: 'J21', sprintDist: 506, maxSpeed: 27.9, carga: 2820, pse: 8.0 },
      { jornada: 'J22', sprintDist: 498, maxSpeed: 27.8, carga: 2960, pse: 8.1 },
    ],
  },
  {
    id: '7',
    name: 'Thiago Lima',
    initials: 'TL',
    number: 10,
    position: 'Meia Atac.',
    profile: 'resist',
    profileLabel: 'Alta resist.',
    age: 27,
    speed: 30.2,
    sprintDistance: 578,
    weeklyLoad: 2890,
    pse: 6.5,
    speedDelta: 1.4,
    sprintDelta: 4.2,
    loadDelta: 2.8,
    pseDelta: -3.2,
    hasAlert: false,
    radar: { velocidade: 79, resistencia: 90, explosividade: 76, carga: 85, recuperacao: 88, tecnica: 92 },
    matchHistory: [
      { jornada: 'J19', sprintDist: 545, maxSpeed: 29.7, carga: 2810, pse: 6.8 },
      { jornada: 'J20', sprintDist: 558, maxSpeed: 29.9, carga: 2840, pse: 6.7 },
      { jornada: 'J21', sprintDist: 565, maxSpeed: 30.0, carga: 2860, pse: 6.6 },
      { jornada: 'J22', sprintDist: 578, maxSpeed: 30.2, carga: 2890, pse: 6.5 },
    ],
  },
  {
    id: '8',
    name: 'Eduardo Mendes',
    initials: 'EM',
    number: 7,
    position: 'Ponta Dir.',
    profile: 'explosivo',
    profileLabel: 'Explosivo',
    age: 23,
    speed: 33.1,
    sprintDistance: 912,
    weeklyLoad: 2180,
    pse: 7.6,
    speedDelta: 12.4,
    sprintDelta: 18.9,
    loadDelta: 4.1,
    pseDelta: 7.8,
    hasAlert: false,
    radar: { velocidade: 96, resistencia: 61, explosividade: 97, carga: 78, recuperacao: 65, tecnica: 72 },
    matchHistory: [
      { jornada: 'J19', sprintDist: 767, maxSpeed: 29.5, carga: 2090, pse: 7.0 },
      { jornada: 'J20', sprintDist: 810, maxSpeed: 30.8, carga: 2120, pse: 7.2 },
      { jornada: 'J21', sprintDist: 868, maxSpeed: 32.1, carga: 2150, pse: 7.4 },
      { jornada: 'J22', sprintDist: 912, maxSpeed: 33.1, carga: 2180, pse: 7.6 },
    ],
  },
]

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
