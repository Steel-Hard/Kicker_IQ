import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  athleteId: {
    type: String,
    required: true,
    index: true,
  },
  athleteName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'carga_elevada',
      'pse_alta',
      'queda_performance',
      'lesao_risco',
      'custom',
    ],
    required: true,
  },
  severity: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active',
    index: true,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  resolvedBy: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

alertSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const AlertModel = mongoose.model('Alert', alertSchema);

export default AlertModel;
