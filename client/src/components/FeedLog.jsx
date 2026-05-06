import React, { useState, useEffect } from 'react';
import { Sprout, Calendar, Hash, DollarSign, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { getRecords, updateRecord, deleteRecord, getBatches } from '../services/api';
import { format } from 'date-fns';

const FeedLog = () => {
  const [records, setRecords] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Edit Form State
  const [formData, setFormData] = useState({
    batchId: '',
    date: '',
    feedQuantity: 0,
    feedCost: 0,
    mortality: 0,
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recordsRes, batchesRes] = await Promise.all([getRecords(), getBatches()]);
      setRecords(recordsRes.data);
      setBatches(batchesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      batchId: record.batchId?._id || '',
      date: format(new Date(record.date), "yyyy-MM-dd'T'HH:mm"),
      feedQuantity: record.feedQuantity,
      feedCost: record.feedCost,
      mortality: record.mortality,
      notes: record.notes || ''
    });
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateRecord(editingRecord._id, formData);
      setShowEditForm(false);
      fetchData();
    } catch (err) {
      alert('Error updating record');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteRecord(deleteConfirm);
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      alert('Error deleting record');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Activity History</h2>
          <p className="text-slate-500 font-medium">Daily records of feed, mortality, and notes</p>
        </div>
        <div className="p-3 bg-warm-100 rounded-2xl text-warm-600">
          <Sprout size={24} />
        </div>
      </header>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <form 
            onSubmit={handleUpdate}
            className="bg-white p-6 sm:p-8 rounded-[2.5rem] w-full max-w-md space-y-6 shadow-2xl scale-in"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">Edit Daily Record</h3>
              <button type="button" onClick={() => setShowEditForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Batch</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-warm-500"
                  value={formData.batchId} onChange={e => setFormData({...formData, batchId: e.target.value})}
                >
                  {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Date</label>
                <input 
                  type="datetime-local"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-warm-500"
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Feed (kg)</label>
                  <input 
                    type="number" step="0.1"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-warm-500"
                    value={formData.feedQuantity} onChange={e => setFormData({...formData, feedQuantity: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mortality</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 bg-rose-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 text-rose-600 font-bold"
                    value={formData.mortality} onChange={e => setFormData({...formData, mortality: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Feed Cost (MWK)</label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 bg-green-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 text-green-600 font-bold"
                  value={formData.feedCost} onChange={e => setFormData({...formData, feedCost: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-800 text-white py-4 rounded-3xl font-black shadow-xl">Update Record</button>
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
              <h3 className="text-xl font-bold text-slate-800">Delete Record?</h3>
              <p className="text-slate-500 mt-2">This will permanently remove this daily log. This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 bg-slate-100">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-rose-600 shadow-lg shadow-rose-200">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Feed (kg)</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deaths</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4"><div className="h-8 bg-slate-50 rounded-lg"></div></td>
                  </tr>
                ))
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">No records found.</td>
                </tr>
              ) : (
                records.map(record => (
                  <tr key={record._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Calendar size={14} className="text-slate-300" />
                        {format(new Date(record.date), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-warm-50 text-warm-700 px-3 py-1 rounded-full text-xs font-bold">
                        {record.batchId?.name || 'Deleted Batch'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-800 font-black">
                        {record.feedQuantity} kg
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-black ${record.mortality > 0 ? 'text-rose-500' : 'text-slate-300'}`}>
                        {record.mortality}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEdit(record)} className="p-2 text-slate-400 hover:text-warm-600 hover:bg-warm-50 rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirm(record._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeedLog;
