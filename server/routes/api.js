const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');
const DailyRecord = require('../models/DailyRecord');
const Vaccination = require('../models/Vaccination');
const Transaction = require('../models/Transaction');

// --- BATCH ROUTES ---
router.get('/batches', async (req, res) => {
  try {
    const batches = await Batch.find().sort({ startDate: -1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/batches', async (req, res) => {
  const batch = new Batch(req.body);
  try {
    const newBatch = await batch.save();
    res.status(201).json(newBatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- DAILY RECORD ROUTES ---
router.get('/records', async (req, res) => {
  try {
    const records = await DailyRecord.find().populate('batchId').sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/records', async (req, res) => {
  const record = new DailyRecord(req.body);
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
        batchId: newRecord.batchId
      }).save();
    }
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- VACCINATION ROUTES ---
router.get('/vaccinations', async (req, res) => {
  try {
    const vaccinations = await Vaccination.find().populate('batchId').sort({ scheduledDate: 1 });
    res.json(vaccinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/vaccinations', async (req, res) => {
  const vacc = new Vaccination(req.body);
  try {
    const newVacc = await vacc.save();
    res.status(201).json(newVacc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/vaccinations/:id', async (req, res) => {
  try {
    const updated = await Vaccination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- TRANSACTION ROUTES ---
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/transactions', async (req, res) => {
  const tx = new Transaction(req.body);
  try {
    const newTx = await tx.save();
    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- DASHBOARD STATS ---
router.get('/dashboard/stats', async (req, res) => {
  try {
    const batches = await Batch.find({ status: 'active' });
    const records = await DailyRecord.find();
    const transactions = await Transaction.find();

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
