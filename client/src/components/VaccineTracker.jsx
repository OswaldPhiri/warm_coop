import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, Calendar, Tag, Trash2, Edit2, X, AlertCircle } from 'lucide-react';
import { getVaccinations, createVaccination, updateVaccination, deleteVaccination, getBatches } from '../services/api';
import { format } from 'date-fns';

const VaccineTracker = () => {
  const [vaccines, setVaccines] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    batchId: '',
    vaccineName: '',
    scheduledDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vRes, bRes] = await Promise.all([getVaccinations(), getBatches()]);
      setVaccines(vRes.data);
      setBatches(bRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenForm = (vaccine = null) => {
    if (vaccine) {
      setEditingVaccine(vaccine);
      setFormData({
        batchId: vaccine.batchId?._id || '',
        vaccineName: vaccine.vaccineName,
        scheduledDate: format(new Date(vaccine.scheduledDate), 'yyyy-MM-dd'),
        notes: vaccine.notes || ''
      });
    } else {
      setEditingVaccine(null);
      setFormData({ batchId: '', vaccineName: '', scheduledDate: '', notes: '' });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVaccine) {
        await updateVaccination(editingVaccine._id, formData);
      } else {
        await createVaccination(formData);
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert('Error saving vaccination');
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateVaccination(id, { isCompleted: true, administeredDate: new Date() });
      fetchData();
    } catch (err) {
      alert('Error updating vaccine');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteVaccination(deleteConfirm);
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      alert('Error deleting vaccine');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vaccination Schedule</h2>
          <p className="text-slate-500 text-sm">Monitor health and immunization schedules</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-green-100"
        >
          <Plus size={18} /> Schedule
        </button>
      </header>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <form 
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-[2.5rem] w-full max-w-md space-y-6 shadow-2xl scale-in"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">{editingVaccine ? 'Edit Vaccination' : 'Add Vaccination'}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Batch</label>
                <select 
                  required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500"
                  value={formData.batchId} onChange={e => setFormData({...formData, batchId: e.target.value})}
                >
                  <option value=""> Choose a batch...</option>
                  {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Vaccine Name</label>
                <input 
                  type="text" required placeholder="Gumboro (Newcastle)"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500"
                  value={formData.vaccineName} onChange={e => setFormData({...formData, vaccineName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Scheduled Date</label>
                <input 
                  type="date" required
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500"
                  value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Notes</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500"
                  rows="2"
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-800 text-white py-4 rounded-3xl font-black shadow-xl shrink-0">
              {editingVaccine ? 'Update Schedule' : 'Schedule Vaccine'}
            </button>
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
              <h3 className="text-xl font-bold text-slate-800">Remove Schedule?</h3>
              <p className="text-slate-500 mt-2">This will permanently delete this vaccination reminder.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 bg-slate-100">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-rose-600 shadow-lg shadow-rose-200">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {vaccines.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] text-center border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No vaccinations scheduled yet.</p>
          </div>
        ) : (
          vaccines.map(v => (
            <div key={v._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-green-200 group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${v.isCompleted ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  {v.isCompleted ? <CheckCircle size={24} /> : <Clock size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{v.vaccineName}</h4>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <span>{v.batchId?.name || 'Unknown Batch'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar size={10} /> {format(new Date(v.scheduledDate), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {!v.isCompleted ? (
                  <button 
                    onClick={() => handleComplete(v._id)}
                    className="flex-1 sm:flex-none bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-black shadow-sm border border-green-100 hover:bg-green-600 hover:text-white transition-all"
                  >
                    Mark Completed
                  </button>
                ) : (
                  <span className="text-green-600 text-xs font-black bg-green-50 px-3 py-1.5 rounded-full">Completed</span>
                )}
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenForm(v)} className="p-2 text-slate-400 hover:text-warm-600 hover:bg-warm-50 rounded-lg">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => setDeleteConfirm(v._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VaccineTracker;
