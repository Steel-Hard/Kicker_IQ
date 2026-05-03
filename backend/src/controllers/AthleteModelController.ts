import { Request, Response } from 'express';
import ModelIntegrationService from '../services/ModelIntegrationService';

class AthleteModelController {
  public async getProfile(req: Request, res: Response) {
    try {
      const metrics = req.body;

      // ValidaÃ§Ã£o bÃ¡sica pode ser feita aqui se necessÃ¡rio

      const result =
        await ModelIntegrationService.predictAthleteProfile(metrics);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AthleteModelController();
