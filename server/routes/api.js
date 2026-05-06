const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');
const DailyRecord = require('../models/DailyRecord');
const Vaccination = require('../models/Vaccination');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// --- BATCH ROUTES ---
router.get('/batches', async (req, res) => {
  try {
    const batches = await Batch.find({ userId: req.user.id }).sort({ startDate: -1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/batches', async (req, res) => {
  const batch = new Batch({
    ...req.body,
    userId: req.user.id
  });
  try {
    const newBatch = await batch.save();
    res.status(201).json(newBatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/batches/:id', async (req, res) => {
  try {
    const updated = await Batch.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Batch not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/batches/:id', async (req, res) => {
  try {
    const deleted = await Batch.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Batch not found' });
    
    // Cleanup related records
    await DailyRecord.deleteMany({ batchId: req.params.id });
    await Vaccination.deleteMany({ batchId: req.params.id });
    await Transaction.deleteMany({ batchId: req.params.id });
    
    res.json({ message: 'Batch deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- DAILY RECORD ROUTES ---
router.get('/records', async (req, res) => {
  try {
    const records = await DailyRecord.find({ userId: req.user.id }).populate('batchId').sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/records', async (req, res) => {
  const record = new DailyRecord({
    ...req.body,
    userId: req.user.id
  });
  try {
    const newRecord = await record.save();
    // Automatically log feed cost as an expense if provided
    if (newRecord.feedCost > 0) {
      await new Transaction({
        type: 'expense',
        category: 'Feed',
        amount: newRecord.feedCost,
        date: newRecord.date,
        description: `Feed for ${newRecord.feedQuantity}kg`,
        batchId: newRecord.batchId,
        userId: req.user.id
      }).save();
    }
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/records/:id', async (req, res) => {
  try {
    const updated = await DailyRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/records/:id', async (req, res) => {
  try {
    const deleted = await DailyRecord.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- VACCINATION ROUTES ---
router.get('/vaccinations', async (req, res) => {
  try {
    const vaccinations = await Vaccination.find({ userId: req.user.id }).populate('batchId').sort({ scheduledDate: 1 });
    res.json(vaccinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/vaccinations', async (req, res) => {
  const vacc = new Vaccination({
    ...req.body,
    userId: req.user.id
  });
  try {
    const newVacc = await vacc.save();
    res.status(201).json(newVacc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/vaccinations/:id', async (req, res) => {
  try {
    const updated = await Vaccination.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Vaccination not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/vaccinations/:id', async (req, res) => {
  try {
    const deleted = await Vaccination.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Vaccination not found' });
    res.json({ message: 'Vaccination deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- TRANSACTION ROUTES ---
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/transactions', async (req, res) => {
  const tx = new Transaction({
    ...req.body,
    userId: req.user.id
  });
  try {
    const newTx = await tx.save();
    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/transactions/:id', async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Transaction not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/transactions/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- DASHBOARD STATS ---
router.get('/dashboard/stats', async (req, res) => {
  try {
    const batches = await Batch.find({ userId: req.user.id, status: 'active' });
    const records = await DailyRecord.find({ userId: req.user.id });
    const transactions = await Transaction.find({ userId: req.user.id });

    const totalInitial = batches.reduce((sum, b) => sum + b.initialCount, 0);
    const totalDeaths = records.reduce((sum, r) => sum + r.mortality, 0);
    const totalFeedKg = records.reduce((sum, r) => sum + r.feedQuantity, 0);
    
    const revenue = transactions.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const profit = revenue - expenses;

    res.json({
      birdsAlive: totalInitial - totalDeaths,
      totalDeaths,
      totalFeedKg,
      revenue,
      expenses,
      profit
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
