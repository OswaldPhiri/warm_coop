import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Hash, Tag, Edit2, X, AlertCircle } from 'lucide-react';
import { getBatches, createBatch, updateBatch, deleteBatch, createRecord } from '../services/api';
import { format } from 'date-fns';

const BirdManager = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form States
  const [batchData, setBatchData] = useState({ name: '', initialCount: '', breed: 'Broiler', status: 'active' });
  const [newLog, setNewLog] = useState({ batchId: '', mortality: '0', feedQuantity: '0', feedCost: '0' });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await getBatches();
      setBatches(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBatchForm = (batch = null) => {
    if (batch) {
      setEditingBatch(batch);
      setBatchData({
        name: batch.name,
        initialCount: batch.initialCount,
        breed: batch.breed,
        status: batch.status
      });
    } else {
      setEditingBatch(null);
      setBatchData({ name: '', initialCount: '', breed: 'Broiler', status: 'active' });
    }
    setShowBatchForm(true);
  };

  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    try {
      if (editingBatch) {
        await updateBatch(editingBatch._id, batchData);
      } else {
        await createBatch(batchData);
      }
      setShowBatchForm(false);
      fetchBatches();
    } catch (err) {
      alert('Error saving batch');
    }
  };

  const handleDeleteBatch = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteBatch(deleteConfirm);
      setDeleteConfirm(null);
      fetchBatches();
    } catch (err) {
      alert('Error deleting batch');
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
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Bird Management</h2>
          <p className="text-slate-500 text-sm">Track your poultry batches and daily logs</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => handleOpenBatchForm()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-warm-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-warm-200 hover:bg-warm-700 transition-all"
          >
            <Plus size={18} /> New Batch
          </button>
          <button 
            onClick={() => setShowLogForm(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all"
          >
            <Plus size={18} /> Daily Log
          </button>
        </div>
      </header>

      {/* Forms Overlay */}
      {showBatchForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <form 
            onSubmit={handleSubmitBatch}
            className="bg-white p-6 sm:p-8 rounded-[2.5rem] w-full max-w-md space-y-6 shadow-2xl scale-in"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">{editingBatch ? 'Edit Batch' : 'Start New Batch'}</h3>
              <button type="button" onClick={() => setShowBatchForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Batch Name</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-3.5 text-slate-300" size={18} />
                  <input 
                    type="text" required placeholder="e.g. April Broilers"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-warm-500 placeholder:text-slate-300 transition-all"
                    value={batchData.name} onChange={e => setBatchData({...batchData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Initial Count</label>
                  <input 
                    type="number" required placeholder="100"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-warm-500"
                    value={batchData.initialCount} onChange={e => setBatchData({...batchData, initialCount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Breed</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-warm-500"
                    value={batchData.breed} onChange={e => setBatchData({...batchData, breed: e.target.value})}
                  >
                    <option>Broiler</option>
                    <option>Layer</option>
                    <option>Local</option>
                  </select>
                </div>
              </div>
              {editingBatch && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Status</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-warm-500"
                    value={batchData.status} onChange={e => setBatchData({...batchData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              )}
            </div>
            <button type="submit" className="w-full bg-warm-600 text-white py-4 rounded-3xl font-black shadow-xl shadow-warm-200">
              {editingBatch ? 'Update Batch' : 'Initialize Batch'}
            </button>
          </form>
        </div>
      )}

      {showLogForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateLog}
            className="bg-white p-6 sm:p-8 rounded-[2.5rem] w-full max-w-md space-y-6 shadow-2xl scale-in"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">Daily Health & Feed Log</h3>
              <button type="button" onClick={() => setShowLogForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Delete Batch?</h3>
              <p className="text-slate-500 mt-2">This will permanently remove the batch and all its associated logs. This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteBatch}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-100 rounded-3xl"></div>)}
        </div>
      ) : batches.length === 0 ? (
        <div className="bg-white p-12 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
          <div className="w-16 h-16 bg-warm-50 text-warm-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bird size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No batches yet</h3>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto">Start by creating your first batch of birds to track their progress.</p>
          <button 
            onClick={() => handleOpenBatchForm()}
            className="mt-6 bg-warm-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-warm-100"
          >
            Create First Batch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {batches.map(batch => (
            <div key={batch._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 group hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                      batch.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {batch.status}
                    </span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full">{batch.breed}</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mt-1">{batch.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenBatchForm(batch)}
                    className="p-2 text-slate-400 hover:text-warm-600 hover:bg-warm-50 rounded-lg transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(batch._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Calendar size={14} />
                Started {format(new Date(batch.startDate), 'MMM d, yyyy')}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-white group-hover:ring-1 group-hover:ring-slate-100 transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting Count</p>
                  <p className="text-lg font-black text-slate-800">{batch.initialCount} <span className="text-xs font-medium text-slate-400">Birds</span></p>
                </div>
                <div className="bg-warm-50 p-4 rounded-2xl group-hover:bg-warm-100 transition-all">
                  <p className="text-[10px] font-black text-warm-700 uppercase tracking-widest mb-1">Current Status</p>
                  <p className="text-lg font-black text-warm-600 capitalize">{batch.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple Bird icon placeholder for empty state
const Bird = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 7-2 2-2-2-2 2-2-2L4 9l2 2 2-2 2 2 2-2 2 2 2-2 2 2" />
    <path d="M4 22h16" />
    <path d="M10 22v-4a2 2 0 0 1 4 0v4" />
    <path d="m18 10-4-8-4 8" />
  </svg>
);

export default BirdManager;
