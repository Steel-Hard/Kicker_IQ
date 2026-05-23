import axios from 'axios';
import { config } from '../config';
import {
  PlayerMetricsInput,
  ModelResult,
  AthleteHistoricalMetrics,
} from '../types/model';

class ModelIntegrationService {
  private api = axios.create({
    baseURL: config.MODEL_SERVICE_URL,
  });

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
      console.error('Error calling Model Service (predict):', error);
      throw new Error('Falha na comunicação com o serviço de IA para predição');
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
      console.error('Error calling Model Service (metrics):', error);
      throw new Error(
        'Falha ao obter métricas históricas do atleta no serviço de IA',
      );
    }
  }
}

export default new ModelIntegrationService();
