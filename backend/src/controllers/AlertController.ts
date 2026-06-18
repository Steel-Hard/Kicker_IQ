import { Request, Response } from 'express';
import { AlertService } from '../services/AlertService';

const service = new AlertService();

export class AlertController {
  public getAll = async (req: Request, res: Response) => {
    try {
      const { status, severity, athleteId } = req.query;

      const filters: Record<string, string> = {};
      if (status && typeof status === 'string') filters.status = status;
      if (severity && typeof severity === 'string') filters.severity = severity;
      if (athleteId && typeof athleteId === 'string')
        filters.athleteId = athleteId;

      const alerts = await service.getAll(filters);
      return res.json(alerts);
    } catch (error: any) {
      console.error('Error in getAll alerts:', error);
      return res.status(500).json({ error: error?.message || 'Erro ao buscar alertas' });
    }
  }

  public getActiveCount = async (_req: Request, res: Response) => {
    try {
      const count = await service.getActiveCount();
      return res.json({ count });
    } catch (error: any) {
      console.error('Error in getActiveCount alerts:', error);
      return res.status(500).json({ error: error?.message || 'Erro ao contar alertas' });
    }
  }

  public getByAthlete = async (req: Request, res: Response) => {
    try {
      const { athleteId } = req.params;
      if (!athleteId) {
        return res.status(400).json({ error: 'athleteId é obrigatório' });
      }

      const alerts = await service.getByAthlete(athleteId);
      return res.json(alerts);
    } catch (error: any) {
      console.error('Error in getByAthlete alerts:', error);
      return res
        .status(500)
        .json({ error: error?.message || 'Erro ao buscar alertas do atleta' });
    }
  }

  public create = async (req: Request, res: Response) => {
    try {
      const { athleteId, athleteName, type, severity, title, description } =
        req.body;

      if (
        !athleteId ||
        !athleteName ||
        !type ||
        !severity ||
        !title ||
        !description
      ) {
        return res
          .status(400)
          .json({ error: 'Todos os campos são obrigatórios' });
      }

      const alert = await service.create({
        athleteId,
        athleteName,
        type,
        severity,
        title,
        description,
      });

      return res.status(201).json(alert);
    } catch (error: any) {
      console.error('Error in create alert:', error);
      return res.status(500).json({ error: error?.message || 'Erro ao criar alerta' });
    }
  }

  public resolve = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { user } = res.locals;
      const userId = user?.id || 'unknown';

      const alert = await service.resolve(id, userId);
      if (!alert) {
        return res.status(404).json({ error: 'Alerta não encontrado' });
      }

      return res.json(alert);
    } catch (error: any) {
      console.error('Error in resolve alert:', error);
      return res.status(500).json({ error: error?.message || 'Erro ao resolver alerta' });
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const alert = await service.delete(id);
      if (!alert) {
        return res.status(404).json({ error: 'Alerta não encontrado' });
      }

      return res.json({ message: 'Alerta removido com sucesso' });
    } catch (error: any) {
      console.error('Error in delete alert:', error);
      return res.status(500).json({ error: error?.message || 'Erro ao deletar alerta' });
    }
  }
}
