import axios from 'axios';
import { config } from '../config';
import AlertModel from '../models/Alert';

class AnalyticsService {
  private api = axios.create({
    baseURL: config.ANALYTICS_SERVICE_URL,
  });

  public async getAthleteHistory(athleteId: string): Promise<any> {
    try {
      const response = await this.api.get(`/api/v1/dashboard/historico/${athleteId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching history for athlete ${athleteId}:`, error.message);
      throw error;
    }
  }

  public async getRadarData(athleteIds: string[], features: string[]): Promise<any> {
    try {
      const response = await this.api.post('/api/v1/dashboard/radar', {
        athlete_ids: athleteIds,
        features: features
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching radar data:', error.message);
      throw error;
    }
  }

  public async getSimilarAthletes(athleteId: string, topN: number = 3): Promise<any> {
    try {
      const response = await this.api.get(`/api/v1/atletas/${athleteId}/similaridade?top_n=${topN}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching similarity for athlete ${athleteId}:`, error.message);
      throw error;
    }
  }

  public async getStats(): Promise<any> {
    try {
      const response = await this.api.get('/api/v1/dashboard/stats');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching analytics stats:', error.message);
      throw error;
    }
  }

  public async getAtletas(): Promise<any> {
    try {
      const response = await this.api.get('/api/v1/atletas/');
      const atletas = response.data;

      if (Array.isArray(atletas)) {
        // Run alert checking in the background to not block the request
        this.processAutoAlerts(atletas).catch(err => 
          console.error('Error in background auto-alerts processing:', err)
        );
      }

      return atletas;
    } catch (error: any) {
      console.error('Error fetching analytics athletes:', error.message);
      throw error;
    }
  }

  private async processAutoAlerts(atletas: any[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const atleta of atletas) {
      if (atleta.performance_status === 'Queda de Desempenho') {
        const existingAlert = await AlertModel.findOne({
          athleteId: atleta.athlete_id,
          type: 'queda_performance',
          $or: [
            { status: 'active' },
            { createdAt: { $gte: today } }
          ]
        });

        if (!existingAlert) {
          await AlertModel.create({
            athleteId: atleta.athlete_id,
            athleteName: atleta.athlete_name || `Atleta ${atleta.athlete_id}`,
            type: 'queda_performance',
            severity: 'high',
            title: 'Queda de Desempenho (IA)',
            description: `O modelo de Inteligência Artificial identificou uma "Queda de Desempenho" para o atleta. Avaliar possível risco de lesão ou necessidade de recuperação.`,
            status: 'active',
          });
        }
      }
    }
  }
}

export default new AnalyticsService();
