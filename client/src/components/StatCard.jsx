import React from 'react';

const StatCard = ({ title, value, unit, icon: Icon, colorClass, subtitle }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorClass}`}>
          <Icon size={24} className="text-white" />
        </div>
        {subtitle && <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{subtitle}</span>}
      </div>
      <div>
        <p className="text-slate-500 font-medium text-sm mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          {unit && <span className="text-slate-400 text-sm font-medium">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
