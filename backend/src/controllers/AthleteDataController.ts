import { Request, Response } from "express";
import { AthleteService } from "../services/AthleteService";

const service = new AthleteService();

export class AthleteController {
  
  async getAll(req: Request, res: Response) {
    try {
      const data = await service.getAllAthletes();
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao buscar atletas" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const data = await service.getAthleteById(id);
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar atleta" });
    }
  }
}