import React from "react";
import { analytics } from "./data";
import { BarChart3, Activity } from "lucide-react";

const AdminReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#D98C00]/10 text-[#D98C00] flex items-center justify-center">
          <BarChart3 size={18} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Insights</p>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Books added per month</p>
              <h3 className="text-lg font-semibold text-gray-900">Catalog growth</h3>
            </div>
            <Activity size={18} className="text-[#D98C00]" />
          </div>
          <SimpleBarChart data={analytics.booksPerMonth} accent="bg-[#D98C00]" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Exchange requests trend</p>
              <h3 className="text-lg font-semibold text-gray-900">Swaps momentum</h3>
            </div>
            <Activity size={18} className="text-indigo-600" />
          </div>
          <SimpleBarChart data={analytics.exchangeTrend} accent="bg-indigo-600" />
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-200 p-4 bg-gray-50 text-sm text-gray-600">
        Charts use lightweight CSS bars and dummy analytics data; swap with Recharts or Chart.js later for live metrics.
      </div>
    </div>
  );
};

const SimpleBarChart = ({ data, accent }) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((point) => {
        const width = `${(point.value / maxValue) * 100}%`;
        return (
          <div key={point.month} className="flex items-center gap-3">
            <div className="w-12 text-xs font-semibold text-gray-600">{point.month}</div>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${accent}`} style={{ width }} />
            </div>
            <div className="w-10 text-xs text-gray-500 text-right">{point.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminReports;
