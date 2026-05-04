import axios from 'axios';
import { config } from '../config';

class ModelIntegrationService {
  private api = axios.create({
    baseURL: config.MODEL_SERVICE_URL,
  });

  public async predictAthleteProfile(metrics: any) {
    try {
      const response = await this.api.post('/api/match/predict', metrics);
      return response.data;
    } catch (error) {
      console.error('Error calling Model Service:', error);
      throw new Error('Falha na comunicaÃ§Ã£o com o serviÃ§o de IA');
    }
  }
}

export default new ModelIntegrationService();
