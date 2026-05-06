import React, { useState, useEffect } from 'react';
import { Plus, Minus, TrendingUp, TrendingDown, Wallet, Calendar, Trash2, Edit2, X, AlertCircle } from 'lucide-react';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/api';
import { format } from 'date-fns';

const FinanceLog = () => {
  const [txs, setTxs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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

  const handleOpenForm = (tx = null) => {
    if (tx) {
      setEditingTx(tx);
      setFormData({
        type: tx.type,
        category: tx.category,
        amount: tx.amount,
        description: tx.description || '',
        date: format(new Date(tx.date), 'yyyy-MM-dd')
      });
    } else {
      setEditingTx(null);
      setFormData({
        type: 'expense',
        category: 'Medication',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTx) {
        await updateTransaction(editingTx._id, formData);
      } else {
        await createTransaction(formData);
      }
      setShowForm(false);
      fetchTxs();
    } catch (err) {
      alert('Error saving transaction');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteTransaction(deleteConfirm);
      setDeleteConfirm(null);
      fetchTxs();
    } catch (err) {
      alert('Error deleting transaction');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financial Logs</h2>
          <p className="text-slate-500 text-sm">Track income and expenses for your farm</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
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
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">{editingTx ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>

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
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-3xl font-black shadow-xl">
              {editingTx ? 'Update Record' : 'Save Record'}
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
              <h3 className="text-xl font-bold text-slate-800">Delete Transaction?</h3>
              <p className="text-slate-500 mt-2">This will permanently remove this financial record.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 bg-slate-100">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-rose-600 shadow-lg shadow-rose-200">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        <ul className="divide-y divide-slate-50">
          {txs.length === 0 ? (
            <li className="p-12 text-center text-slate-400 font-medium">No financial records yet.</li>
          ) : (
            txs.map(t => (
              <li key={t._id} className="p-5 flex justify-between items-center hover:bg-slate-50 transition-colors group">
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
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={`text-lg font-black ${t.type === 'revenue' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'revenue' ? '+' : '-'}{t.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-black text-slate-300 uppercase letter-wider">MWK</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenForm(t)} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => setDeleteConfirm(t._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
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
