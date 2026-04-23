import React, { useState, useEffect } from 'react';
import { Sprout, Calendar, Hash, DollarSign } from 'lucide-react';
import { getRecords } from '../services/api';
import { format } from 'date-fns';

const FeedLog = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await getRecords();
      setRecords(res.data.filter(r => r.feedQuantity > 0)); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Feed Consumption History</h2>
          <p className="text-slate-500 font-medium">Track efficiency and costs over time</p>
        </div>
        <div className="p-3 bg-warm-100 rounded-2xl text-warm-600">
          <Sprout size={24} />
        </div>
      </header>

      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity (kg)</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cost (MWK)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">No feed consumption logs found.</td>
                </tr>
              ) : (
                records.map(record => (
                  <tr key={record._id} className="hover:bg-slate-50 transition-colors">
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
                        <Hash size={14} className="text-slate-300" />
                        {record.feedQuantity} kg
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-black">
                        <DollarSign size={14} className="text-green-300" />
                        {record.feedCost.toLocaleString()}
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
