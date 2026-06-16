import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';

const dashboardService = new DashboardService();

export class DashboardController {
  public getSummary = async (req: Request, res: Response) => {
    try {
      const data = await dashboardService.getDashboardSummary();
      return res.json(data);
    } catch (error: any) {
      console.error('Error fetching dashboard summary:', error);
      return res
        .status(500)
        .json({ error: error?.message || 'Erro ao buscar resumo do dashboard' });
    }
  }
}
