const mongoose = require('mongoose');

const dailyRecordSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  date: { type: Date, default: Date.now },
  mortality: { type: Number, default: 0 },
  feedQuantity: { type: Number, default: 0 }, // in kg
  feedCost: { type: Number, default: 0 }, // in local currency (MWK)
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('DailyRecord', dailyRecordSchema);
