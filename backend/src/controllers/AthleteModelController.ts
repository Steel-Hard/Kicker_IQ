import { Request, Response } from 'express';
import ModelIntegrationService from '../services/ModelIntegrationService';

class AthleteModelController {
  public getProfile = async (req: Request, res: Response) => {
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
      console.error('Error in getProfile:', error);
      res.status(500).json({ message: error?.message || 'Erro interno no servidor' });
    }
  }

  public getTeamClassification = async (req: Request, res: Response) => {
    try {
      const filters = req.query;
      const result = await ModelIntegrationService.getTeamClassification(
        filters as any,
      );
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in getTeamClassification:', error);
      res.status(500).json({ message: error?.message || 'Erro interno no servidor' });
    }
  }

  public getAthleteTimeline = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const filters = req.query;
      const result = await ModelIntegrationService.getAthleteProfileTimeline(
        Number(id),
        filters as any,
      );
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in getAthleteTimeline:', error);
      res.status(500).json({ message: error?.message || 'Erro interno no servidor' });
    }
  }
}

export default new AthleteModelController();
