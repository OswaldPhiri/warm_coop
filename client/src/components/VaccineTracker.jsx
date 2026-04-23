import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, Calendar, Tag } from 'lucide-react';
import { getVaccinations, createVaccination, updateVaccination, getBatches } from '../services/api';
import { format } from 'date-fns';

const VaccineTracker = () => {
  const [vaccines, setVaccines] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVaccination(formData);
      setFormData({ batchId: '', vaccineName: '', scheduledDate: '', notes: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert('Error scheduling vaccine');
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

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Vaccination Schedule</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-greenery-600 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-green-100"
        >
          <Plus size={18} /> Schedule Vaccine
        </button>
      </header>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <form 
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-[2.5rem] w-full max-w-md space-y-6 shadow-2xl scale-in"
          >
            <h3 className="text-xl font-black text-slate-800">Add Vaccination Schedule</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Batch</label>
                <select 
                  required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-greenery-500"
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
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-greenery-500"
                  value={formData.vaccineName} onChange={e => setFormData({...formData, vaccineName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Scheduled Date</label>
                <input 
                  type="date" required
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-greenery-500"
                  value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 text-slate-400 font-bold">Cancel</button>
              <button type="submit" className="flex-[2] bg-greenery-600 text-white py-4 rounded-3xl font-black shadow-xl shrink-0">Schedule</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {vaccines.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] text-center border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No vaccinations scheduled yet.</p>
          </div>
        ) : (
          vaccines.map(v => (
            <div key={v._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-greenery-200">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${v.isCompleted ? 'bg-greenery-100 text-greenery-600' : 'bg-amber-100 text-amber-600'}`}>
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
              
              {!v.isCompleted ? (
                <button 
                  onClick={() => handleComplete(v._id)}
                  className="w-full sm:w-auto bg-greenery-50 text-greenery-600 px-4 py-2 rounded-xl text-xs font-black shadow-sm border border-greenery-100 hover:bg-greenery-600 hover:text-white transition-all"
                >
                  Mark Completed
                </button>
              ) : (
                <span className="text-greenery-600 text-xs font-black bg-greenery-50 px-3 py-1.5 rounded-full">Completed</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VaccineTracker;
