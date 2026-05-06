const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['revenue', 'expense'], required: true },
  category: { type: String, required: true }, // e.g., "Feed", "Vaccine", "Bird Sale", "Egg Sale"
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }, // Optional: link to a specific batch
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
