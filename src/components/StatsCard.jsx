// REMOVED the "LucideIcon" import that was causing the crash
import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {/* Render the icon component passed as a prop */}
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );
};

export default StatsCard;