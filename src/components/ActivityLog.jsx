import React from "react";
import { Clock, Plus, Trash2, Edit2, FileDown } from "lucide-react";

const ActivityLog = ({ activities }) => {
  // Helper to pick icons
  const getIcon = (type) => {
    switch (type) {
      case "add":
        return <Plus size={14} className="text-emerald-600" />;
      case "delete":
        return <Trash2 size={14} className="text-red-600" />;
      case "edit":
        return <Edit2 size={14} className="text-blue-600" />;
      case "export":
        return <FileDown size={14} className="text-purple-600" />;
      default:
        return <Clock size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Clock size={18} />
          Recent Activity
        </h3>
      </div>

      <div className="overflow-y-auto p-4 space-y-4 max-h-96">
        {activities.length === 0 ? (
          <p className="text-slate-400 text-sm text-center italic">
            No recent activity.
          </p>
        ) : (
          activities.map((log) => (
            <div
              key={log.id}
              className="flex gap-3 items-start pb-3 border-b border-slate-50 last:border-0"
            >
              <div className="mt-1 p-1.5 bg-slate-100 rounded-md">
                {getIcon(log.type)}
              </div>
              <div>
                <p className="text-sm text-slate-800 font-medium">
                  {log.message}
                </p>
                <p className="text-xs text-slate-400">{log.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
