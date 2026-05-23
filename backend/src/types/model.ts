export interface PlayerMetricsInput {
  distanceM: number;
  highIntensityRunningM: number;
  highIntensityEvents: number;
  sprintDistanceM: number;
  numberOfSprints: number;
  topSpeedKph: number;
  avgSpeedKph: number;
  accelerations: number;
  decelerations: number;
  metresPerMinuteM: number;
  workloadIntensity: number;
}

export interface ModelScore {
  cluster: string;
  score: string;
}

export interface ModelResult {
  clusterIndex: number;
  clusterName: string;
  confidence: string;
  allScores: ModelScore[];
}

export interface AthleteHistoricalMetrics {
  resistente: number;
  explosivo: number;
  baixo_volume: number;
  moderado: number;
  [key: string]: number;
}
