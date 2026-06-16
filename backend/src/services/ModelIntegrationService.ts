import axios, { AxiosError } from 'axios';
import { config } from '../config';
import AlertModel from '../models/Alert';
import {
  PlayerMetricsInput,
  ModelResult,
  AthleteHistoricalMetrics,
  BatchPredictInput,
  BatchPredictResult,
  ClassificationFilters,
  TeamClassificationResponse,
  TeamTrendsResponse,
  AthleteTimelineResponse,
  AthleteProfileSummaryResponse,
  MetaClassesResponse,
  ModelHealthResponse,
} from '../types/model';

class ModelIntegrationService {
  private api = axios.create({
    baseURL: config.MODEL_SERVICE_URL,
  });

  private handleError(context: string, error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      console.error(`Error calling Model Service (${context}):`, {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        message: axiosError.message
      });
      const remoteError = axiosError.response?.data?.error || axiosError.response?.data?.message;
      throw new Error(`Model Service Error (${context}): ${remoteError || axiosError.message}`);
    }
    console.error(`Unexpected error in Model Service integration (${context}):`, error);
    throw error;
  }

  public async predictAthleteProfile(
    metrics: PlayerMetricsInput,
  ): Promise<ModelResult> {
    try {
      const response = await this.api.post<ModelResult>(
        '/api/match/predict',
        metrics,
      );
      return response.data;
    } catch (error) {
      throw this.handleError('predict', error);
    }
  }

  public async batchPredictProfiles(
    input: BatchPredictInput,
  ): Promise<BatchPredictResult> {
    try {
      const response = await this.api.post<BatchPredictResult>(
        '/api/athletes/batch-predict',
        input,
      );
      return response.data;
    } catch (error) {
      throw this.handleError('batch-predict', error);
    }
  }

  public async getAthleteMetrics(
    athleteId: number,
  ): Promise<AthleteHistoricalMetrics> {
    try {
      const response = await this.api.get<AthleteHistoricalMetrics>(
        `/api/athlete/metrics?id=${athleteId}`,
      );
      return response.data;
    } catch (error) {
      throw this.handleError('metrics', error);
    }
  }

  public async getAthleteProfileTimeline(
    athleteId: number,
    filters?: Omit<ClassificationFilters, 'ids'>,
  ): Promise<AthleteTimelineResponse> {
    try {
      const response = await this.api.get<AthleteTimelineResponse>(
        `/api/athlete/${athleteId}/profile-timeline`,
        { params: filters },
      );
      return response.data;
    } catch (error) {
      throw this.handleError('profile-timeline', error);
    }
  }

  public async getAthleteProfileSummary(
    athleteId: number,
    filters?: Omit<ClassificationFilters, 'ids'>,
  ): Promise<AthleteProfileSummaryResponse> {
    try {
      const response = await this.api.get<AthleteProfileSummaryResponse>(
        `/api/athlete/${athleteId}/profile-summary`,
        { params: filters },
      );
      return response.data;
    } catch (error) {
      throw this.handleError('profile-summary', error);
    }
  }

  public async getTeamClassification(
    filters?: ClassificationFilters,
  ): Promise<TeamClassificationResponse> {
    try {
      const response = await this.api.get<TeamClassificationResponse>(
        '/api/team/classification',
        { params: filters },
      );
      return response.data;
    } catch (error) {
      throw this.handleError('team-classification', error);
    }
  }

  public async getTeamTrends(
    bucket: 'day' | 'week' | 'month',
    filters?: ClassificationFilters,
  ): Promise<TeamTrendsResponse> {
    try {
      const response = await this.api.get<TeamTrendsResponse>(
        '/api/team/trends',
        { params: { ...filters, bucket } },
      );
      return response.data;
    } catch (error) {
      throw this.handleError('team-trends', error);
    }
  }

  public async getMetaClasses(): Promise<MetaClassesResponse> {
    try {
      const response =
        await this.api.get<MetaClassesResponse>('/api/meta/classes');
      return response.data;
    } catch (error) {
      throw this.handleError('meta-classes', error);
    }
  }

  public async getModelHealth(): Promise<ModelHealthResponse> {
    try {
      const response =
        await this.api.get<ModelHealthResponse>('/api/health/model');
      return response.data;
    } catch (error) {
      throw this.handleError('health', error);
    }
  }
}

export default new ModelIntegrationService();
