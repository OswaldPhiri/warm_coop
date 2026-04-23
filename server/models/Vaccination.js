const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  vaccineName: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  administeredDate: { type: Date },
  isCompleted: { type: Boolean, default: false },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Vaccination', vaccinationSchema);
