import React, { useState, useEffect } from 'react';
import { Bird, Skull, Sprout, DollarSign, TrendingUp, Wallet } from 'lucide-react';
import StatCard from './StatCard';
import { getDashboardStats, getTransactions } from '../services/api';
import { exportToCSV } from '../services/export';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await getTransactions();
      exportToCSV(res.data, 'warmcoop_finances');
    } catch (err) {
      alert('Export failed');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><p className="text-warm-600 font-bold animate-pulse">Loading Farm Data...</p></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Farm Overview</h2>
          <p className="text-slate-500 font-medium">Monitoring your poultry business in Malawi</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="bg-slate-100 px-6 py-2 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-200 transition-all"
          >
            Export CSV
          </button>
          <button 
            onClick={fetchStats}
            className="bg-white px-6 py-2 rounded-full border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Refresh Data
          </button>
        </div>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Birds Alive" 
          value={stats?.birdsAlive || 0} 
          unit="birds" 
          icon={Bird} 
          colorClass="bg-green-500" 
          subtitle="Currently"
        />
        <StatCard 
          title="Total Mortality" 
          value={stats?.totalDeaths || 0} 
          unit="deaths" 
          icon={Skull} 
          colorClass="bg-red-500" 
          subtitle="All-time"
        />
        <StatCard 
          title="Feed Consumed" 
          value={stats?.totalFeedKg?.toFixed(1) || 0} 
          unit="kg" 
          icon={Sprout} 
          colorClass="bg-warm-500" 
          subtitle="Cumulative"
        />
      </div>

      {/* Financial Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={stats?.revenue?.toLocaleString() || 0} 
          unit="MWK" 
          icon={TrendingUp} 
          colorClass="bg-emerald-600" 
        />
        <StatCard 
          title="Total Expenses" 
          value={stats?.expenses?.toLocaleString() || 0} 
          unit="MWK" 
          icon={Wallet} 
          colorClass="bg-amber-600" 
        />
        <StatCard 
          title="Estimated Profit" 
          value={stats?.profit?.toLocaleString() || 0} 
          unit="MWK" 
          icon={DollarSign} 
          colorClass={stats?.profit >= 0 ? 'bg-indigo-600' : 'bg-rose-600'} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-500" />
            Performance Metric
          </h3>
          <div className="h-64 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Jan', val: 400 },
                { name: 'Feb', val: 300 },
                { name: 'Mar', val: 600 },
                { name: 'Apr', val: 800 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="val" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">Chart data is illustrative. Connect real data to see trends.</p>
        </div>

        <div className="bg-warm-600 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2 leading-tight">Farmer's Helper</h3>
            <p className="text-warm-100 text-sm font-medium mb-6">Manage your poultry easily from your phone.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="bg-white/20 p-2 rounded-lg"><Bird size={20} /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-60">Success Tip</p>
                  <p className="text-sm font-medium">Keep coop ventilation strictly maintained.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
