import { Request, Response } from 'express';
import { AthleteService } from '../services/AthleteService';

const service = new AthleteService();

export class AthleteController {
  public getAll = async (req: Request, res: Response) => {
    try {
      const data = await service.getAllAthletes();
      return res.json(data);
    } catch (error: any) {
      console.error('Error in getAll athletes:', error);
      return res.status(500).json({ error: error?.message || 'Erro ao buscar atletas' });
    }
  }

  public getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const data = await service.getAthleteById(id);
      return res.json(data);
    } catch (error: any) {
      console.error('Error in getById athlete:', error);
      return res.status(500).json({ error: error?.message || 'Erro ao buscar atleta' });
    }
  }

  public getByDate = async (req: Request, res: Response) => {
    try {
      const { date } = req.params;
      if (!date) {
        return res.status(400).json({ error: 'Data não fornecida' });
      }
      const data = await service.getAthletesByDate(date);
      return res.json(data);
    } catch (error: any) {
      console.error('Error in getByDate athletes:', error);
      return res.status(500).json({ error: error?.message || 'Erro ao buscar atletas por data' });
    }
  }

  public importAthletes = async (req: Request, res: Response) => {
    try {
      const { records } = req.body;
      if (!Array.isArray(records)) {
        return res.status(400).json({ error: 'Formato de dados inválido' });
      }

      await service.importData(records);
      return res.json({
        message: `${records.length} registros importados com sucesso`,
      });
    } catch (error: any) {
      console.error('Error in importAthletes:', error);
      return res.status(500).json({ error: error?.message || 'Erro ao importar dados' });
    }
  }
}
