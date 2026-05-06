const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Batch 1 - April 2026"
  breed: { type: String, default: 'Broiler' },
  initialCount: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
