import { Request, Response } from 'express';
import ModelIntegrationService from '../services/ModelIntegrationService';

class AthleteModelController {
  public async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.query;

      if (id) {
        const result = await ModelIntegrationService.getAthleteMetrics(
          Number(id),
        );
        return res.status(200).json(result);
      }

      const metrics = req.body;
      const result =
        await ModelIntegrationService.predictAthleteProfile(metrics);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AthleteModelController();
