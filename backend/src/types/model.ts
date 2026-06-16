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

export interface BatchPredictInput {
  athletes: Array<{
    athleteId?: number;
    metrics: PlayerMetricsInput;
  }>;
}

export interface BatchPredictResult {
  total: number;
  successCount: number;
  failureCount: number;
  results: Array<{
    index: number;
    athleteId?: number;
    status: 'success' | 'error';
    prediction?: ModelResult;
    error?: string;
  }>;
}

export interface ClassificationFilters {
  ids?: number[];
  from?: string;
  to?: string;
  segment?: string;
}

export interface TeamClassificationResponse {
  totalAthletes: number;
  distribution: Record<string, number>;
  percentages: Record<string, number>;
  athletes: Array<{
    athleteId: number;
    dominantClass: string;
    classPercentages: Record<string, number>;
    sessions: number;
  }>;
  filters: ClassificationFilters;
  updatedAt: string;
}

export interface TeamTrendsResponse {
  bucket: 'day' | 'week' | 'month';
  points: Array<{
    period: string;
    resistente: number;
    explosivo: number;
    baixo_volume: number;
    moderado: number;
  }>;
  filters: ClassificationFilters;
  updatedAt: string;
}

export interface AthleteTimelineResponse {
  athleteId: number;
  timeline: Array<{
    date: string;
    segment: string;
    clusterName: string;
    confidence: string;
  }>;
  filters: Omit<ClassificationFilters, 'ids'>;
  updatedAt: string;
}

export interface AthleteProfileSummaryResponse {
  athleteId: number;
  dominantClass: string;
  classPercentages: Record<string, number>;
  totalSessions: number;
  lastPredictionAt: string | null;
  filters: Omit<ClassificationFilters, 'ids'>;
  updatedAt: string;
}

export interface MetaClassItem {
  key: string;
  label: string;
  color: string;
  order: number;
  description: string;
}

export interface MetaClassesResponse {
  classes: MetaClassItem[];
  updatedAt: string;
}

export interface ModelHealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  dependencies: {
    db: { status: string; latencyMs?: number; error?: string };
    model: { status: string; error?: string };
    scaler: { status: string; error?: string };
  };
}
