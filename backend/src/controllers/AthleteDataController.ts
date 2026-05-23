import { Request, Response } from 'express';
import { AthleteService } from '../services/AthleteService';

const service = new AthleteService();

export class AthleteController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await service.getAllAthletes();
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao buscar atletas' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const data = await service.getAthleteById(id);
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar atleta' });
    }
  }

  async getByDate(req: Request, res: Response) {
    try {
      const { date } = req.params;
      if (!date) {
        return res.status(400).json({ error: 'Data não fornecida' });
      }
      const data = await service.getAthletesByDate(date);
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar atletas por data' });
    }
  }

  async importAthletes(req: Request, res: Response) {
    try {
      const { records } = req.body;
      if (!Array.isArray(records)) {
        return res.status(400).json({ error: 'Formato de dados inválido' });
      }

      await service.importData(records);
      return res.json({
        message: `${records.length} registros importados com sucesso`,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao importar dados' });
    }
  }
}
