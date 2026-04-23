import React, { useState, useEffect } from 'react';
import { Plus, Minus, TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { getTransactions, createTransaction } from '../services/api';
import { format } from 'date-fns';

const FinanceLog = () => {
  const [txs, setTxs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Medication',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTxs();
  }, []);

  const fetchTxs = async () => {
    try {
      const res = await getTransactions();
      setTxs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTransaction(formData);
      setFormData({ ...formData, amount: '', description: '' });
      setShowForm(false);
      fetchTxs();
    } catch (err) {
      alert('Error saving transaction');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Financial Logs</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg"
        >
          <Plus size={18} /> Add Record
        </button>
      </header>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <form 
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-[2.5rem] w-full max-w-md space-y-6 shadow-2xl scale-in"
          >
            <h3 className="text-xl font-black text-slate-800">Add Transaction</h3>
            <div className="space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'expense'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${formData.type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400'}`}
                >
                  <Minus size={14} /> Expense
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'revenue'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${formData.type === 'revenue' ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-400'}`}
                >
                  <Plus size={14} /> Revenue
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-800"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <optgroup label="Expenses">
                      <option>Feed</option>
                      <option>Medication</option>
                      <option>Electricity/Water</option>
                      <option>Other Expense</option>
                    </optgroup>
                    <optgroup label="Revenue">
                      <option>Bird Sale</option>
                      <option>Egg Sale</option>
                      <option>Manure Sale</option>
                      <option>Other Revenue</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Amount (MWK)</label>
                  <input 
                    type="number" required placeholder="5000"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-800 font-bold"
                    value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                <input 
                  type="text" placeholder="Bought 2 bags of starter feed"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-800"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Date</label>
                <input 
                  type="date" required
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-800"
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 text-slate-400 font-bold">Cancel</button>
              <button type="submit" className="flex-[2] bg-slate-900 text-white py-4 rounded-3xl font-black shadow-xl">Save Record</button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        <ul className="divide-y divide-slate-50">
          {txs.length === 0 ? (
            <li className="p-12 text-center text-slate-400 font-medium">No financial records yet.</li>
          ) : (
            txs.map(t => (
              <li key={t._id} className="p-5 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${t.type === 'revenue' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {t.type === 'revenue' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{t.category}</h4>
                    <p className="text-xs text-slate-400 font-medium">{t.description || 'No description'}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-300 font-black uppercase mt-1">
                      <Calendar size={10} /> {format(new Date(t.date), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black ${t.type === 'revenue' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'revenue' ? '+' : '-'}{t.amount.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-black text-slate-300 uppercase letter-wider">MWK</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default FinanceLog;
