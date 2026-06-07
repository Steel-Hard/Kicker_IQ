import AlertModel from '../models/Alert';

interface AlertFilters {
  status?: 'active' | 'resolved';
  severity?: 'high' | 'medium' | 'low';
  athleteId?: string;
}

interface CreateAlertData {
  athleteId: string;
  athleteName: string;
  type: string;
  severity: string;
  title: string;
  description: string;
}

export class AlertService {
  async getAll(filters: AlertFilters = {}) {
    const query: Record<string, unknown> = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.severity) {
      query.severity = filters.severity;
    }
    if (filters.athleteId) {
      query.athleteId = filters.athleteId;
    }

    return AlertModel.find(query).sort({ createdAt: -1 });
  }

  async getActiveCount() {
    return AlertModel.countDocuments({ status: 'active' });
  }

  async getById(id: string) {
    return AlertModel.findById(id);
  }

  async getByAthlete(athleteId: string) {
    return AlertModel.find({ athleteId }).sort({ createdAt: -1 });
  }

  async create(data: CreateAlertData) {
    const alert = new AlertModel(data);
    return alert.save();
  }

  async resolve(id: string, userId: string) {
    return AlertModel.findByIdAndUpdate(
      id,
      {
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedBy: userId,
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  async delete(id: string) {
    return AlertModel.findByIdAndDelete(id);
  }
}
