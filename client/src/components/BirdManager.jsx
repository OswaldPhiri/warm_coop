import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Hash, Tag } from 'lucide-react';
import { getBatches, createBatch, createRecord } from '../services/api';
import { format } from 'date-fns';

const BirdManager = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);

  // Form States
  const [newBatch, setNewBatch] = useState({ name: '', initialCount: '', breed: 'Broiler' });
  const [newLog, setNewLog] = useState({ batchId: '', mortality: '0', feedQuantity: '0', feedCost: '0' });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await getBatches();
      setBatches(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      await createBatch(newBatch);
      setNewBatch({ name: '', initialCount: '', breed: 'Broiler' });
      setShowBatchForm(false);
      fetchBatches();
    } catch (err) {
      alert('Error creating batch');
    }
  };

  const handleCreateLog = async (e) => {
    e.preventDefault();
    try {
      await createRecord(newLog);
      setNewLog({ batchId: '', mortality: '0', feedQuantity: '0', feedCost: '0' });
      setShowLogForm(false);
      alert('Logs saved successfully!');
    } catch (err) {
      alert('Error saving logs');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Bird Management</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowBatchForm(true)}
            className="flex items-center gap-2 bg-warm-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-warm-200"
          >
            <Plus size={18} /> New Batch
          </button>
          <button 
            onClick={() => setShowLogForm(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-200"
          >
            <Plus size={18} /> Daily Log
          </button>
        </div>
      </header>

      {/* Forms Overlay */}
      {showBatchForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateBatch}
            className="bg-white p-8 rounded-[2.5rem] w-full max-w-md space-y-6 shadow-2xl scale-in"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">Start New Batch</h3>
              <button type="button" onClick={() => setShowBatchForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><Trash2 size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Batch Name</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-3.5 text-slate-300" size={18} />
                  <input 
                    type="text" required placeholder="e.g. April Broilers"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-warm-500 placeholder:text-slate-300 transition-all"
                    value={newBatch.name} onChange={e => setNewBatch({...newBatch, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Initial Count</label>
                  <input 
                    type="number" required placeholder="100"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-warm-500"
                    value={newBatch.initialCount} onChange={e => setNewBatch({...newBatch, initialCount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Breed</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-warm-500"
                    value={newBatch.breed} onChange={e => setNewBatch({...newBatch, breed: e.target.value})}
                  >
                    <option>Broiler</option>
                    <option>Layer</option>
                    <option>Local</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-warm-600 text-white py-4 rounded-3xl font-black shadow-xl shadow-warm-200">Initialize Batch</button>
          </form>
        </div>
      )}

      {showLogForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateLog}
            className="bg-white p-8 rounded-[2.5rem] w-full max-w-md space-y-6 shadow-2xl scale-in"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">Daily Health & Feed Log</h3>
              <button type="button" onClick={() => setShowLogForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><Trash2 size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Batch</label>
                <select 
                  required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-warm-500"
                  value={newLog.batchId} onChange={e => setNewLog({...newLog, batchId: e.target.value})}
                >
                  <option value=""> Choose a batch...</option>
                  {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 text-rose-500">Mortality (Deaths)</label>
                  <input 
                    type="number" required
                    className="w-full px-4 py-3 bg-rose-50/50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 font-bold text-rose-600"
                    value={newLog.mortality} onChange={e => setNewLog({...newLog, mortality: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Feed Quantity (kg)</label>
                  <input 
                    type="number" step="0.1" required
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-warm-500"
                    value={newLog.feedQuantity} onChange={e => setNewLog({...newLog, feedQuantity: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 font-black">Feed Cost (MWK)</label>
                <input 
                  type="number" required
                  className="w-full px-4 py-3 bg-green-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-bold text-green-600"
                  value={newLog.feedCost} onChange={e => setNewLog({...newLog, feedCost: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-800 text-white py-4 rounded-3xl font-black shadow-xl">Submit Logs</button>
          </form>
        </div>
      )}

      {/* Batch List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {batches.map(batch => (
          <div key={batch._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full">{batch.breed}</span>
                <h4 className="text-xl font-bold text-slate-800 mt-1">{batch.name}</h4>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                <Calendar size={14} />
                {format(new Date(batch.startDate), 'MMM d, yyyy')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting Count</p>
                <p className="text-lg font-black text-slate-800">{batch.initialCount} <span className="text-xs font-medium text-slate-400">Birds</span></p>
              </div>
              <div className="bg-warm-50 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-warm-700 uppercase tracking-widest mb-1">Current Status</p>
                <p className="text-lg font-black text-warm-600 capitalize">{batch.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BirdManager;
