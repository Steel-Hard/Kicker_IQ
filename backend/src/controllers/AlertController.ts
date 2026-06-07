import { Request, Response } from 'express';
import { AlertService } from '../services/AlertService';

const service = new AlertService();

export class AlertController {
  async getAll(req: Request, res: Response) {
    try {
      const { status, severity, athleteId } = req.query;

      const filters: Record<string, string> = {};
      if (status && typeof status === 'string') filters.status = status;
      if (severity && typeof severity === 'string') filters.severity = severity;
      if (athleteId && typeof athleteId === 'string')
        filters.athleteId = athleteId;

      const alerts = await service.getAll(filters);
      return res.json(alerts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar alertas' });
    }
  }

  async getActiveCount(_req: Request, res: Response) {
    try {
      const count = await service.getActiveCount();
      return res.json({ count });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao contar alertas' });
    }
  }

  async getByAthlete(req: Request, res: Response) {
    try {
      const { athleteId } = req.params;
      if (!athleteId) {
        return res.status(400).json({ error: 'athleteId é obrigatório' });
      }

      const alerts = await service.getByAthlete(athleteId);
      return res.json(alerts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar alertas do atleta' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { athleteId, athleteName, type, severity, title, description } =
        req.body;

      if (!athleteId || !athleteName || !type || !severity || !title || !description) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar alerta' });
    }
  }

  async resolve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // userId from JWT token payload
      const userId = (req as any).user?.id || 'unknown';

      const alert = await service.resolve(id, userId);
      if (!alert) {
        return res.status(404).json({ error: 'Alerta não encontrado' });
      }

      return res.json(alert);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao resolver alerta' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const alert = await service.delete(id);
      if (!alert) {
        return res.status(404).json({ error: 'Alerta não encontrado' });
      }

      return res.json({ message: 'Alerta removido com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar alerta' });
    }
  }
}
