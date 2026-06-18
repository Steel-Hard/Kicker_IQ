import { Request, Response } from 'express';
import AnalyticsService from '../services/AnalyticsService';

class AnalyticsController {
  public getAthleteHistory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await AnalyticsService.getAthleteHistory(id);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public getRadarData = async (req: Request, res: Response) => {
    try {
      const { athleteIds, features } = req.body;
      const data = await AnalyticsService.getRadarData(athleteIds, features);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public getSimilarAthletes = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { topN } = req.query;
      const data = await AnalyticsService.getSimilarAthletes(id, Number(topN) || 3);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public getStats = async (req: Request, res: Response) => {
    try {
      const data = await AnalyticsService.getStats();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public getAtletas = async (req: Request, res: Response) => {
    try {
      const data = await AnalyticsService.getAtletas();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AnalyticsController();
