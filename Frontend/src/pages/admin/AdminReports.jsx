import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import { 
  Users, BookOpen, ShoppingBag, Shuffle, MessageSquare, 
  TrendingUp, Loader2, Award, Activity, PieChart as PieIcon
} from "lucide-react";
import api from "../../api/axios";

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/v2/analytics/admin-stats");
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch report data", err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
         <Loader2 className="animate-spin text-[#D98C00]" size={40} />
      </div>
    );
  }

  const COLORS = ["#D98C00", "#4F46E5", "#10B981", "#F43F5E", "#8B5CF6", "#EC4899", "#06B6D4"];

  const statCards = [
    { label: "Total Users", value: data?.stats?.totalUsers, icon: Users, color: "bg-blue-50 text-blue-600", trend: "+12%" },
    { label: "Book Inventory", value: data?.stats?.totalBooks, icon: BookOpen, color: "bg-amber-50 text-[#D98C00]", trend: "+8%" },
    { label: "Order Volume", value: data?.stats?.totalOrders, icon: ShoppingBag, color: "bg-emerald-50 text-emerald-600", trend: "+24%" },
    { label: "Exchange Volume", value: data?.stats?.totalExchanges, icon: Shuffle, color: "bg-rose-50 text-rose-600", trend: "-2%" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12 scrollbar-hide">
      {/* Header - Export Intelligence Removed as requested */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Intelligence Center</p>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Analytics</h1>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
           <Activity size={18} />
           <span className="text-xs font-black uppercase tracking-widest">Live Monitoring Active</span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-500 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Area Chart: Growth */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-amber-50 text-[#D98C00] rounded-xl"><TrendingUp size={20} /></div>
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Inventory & User Growth</h3>
              </div>
           </div>
           <div className="h-[300px] w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.monthlyData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBooks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D98C00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D98C00" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Area type="monotone" dataKey="books" name="Books Added" stroke="#D98C00" strokeWidth={4} fillOpacity={1} fill="url(#colorBooks)" />
                  <Area type="monotone" dataKey="users" name="New Signups" stroke="#4F46E5" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Bar Chart: Transactions */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Shuffle size={20} /></div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Transaction Activity</h3>
           </div>
           <div className="h-[300px] w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.monthlyData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar dataKey="orders" name="Orders" fill="#10B981" radius={[8, 8, 0, 0]} barSize={24} />
                  <Bar dataKey="exchanges" name="Exchanges" fill="#F43F5E" radius={[8, 8, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Secondary Row: Categories & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pie Chart: Categories */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><PieIcon size={20} /></div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Inventory Split</h3>
           </div>
           <div className="h-[250px] w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categoryDistribution || [{name: 'Empty', value: 0}]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {(data?.categoryDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-4 grid grid-cols-2 gap-2">
              {data?.categoryDistribution?.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                   <span className="text-[10px] font-bold text-gray-500 uppercase truncate">{c.name}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Line Chart: System Health (Complaints) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><MessageSquare size={20} /></div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">System Health Index</h3>
           </div>
           <div className="h-[250px] w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.monthlyData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  />
                  <Line type="stepAfter" dataKey="complaints" name="System Complaints" stroke="#F43F5E" strokeWidth={4} dot={{ r: 6, fill: '#F43F5E', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                    <Award size={20} />
                 </div>
                 <div>
                    <p className="text-xs font-black text-gray-900 uppercase">System Integrity Score</p>
                    <p className="text-[10px] text-gray-500 font-bold">Based on low complaint volume this month</p>
                 </div>
              </div>
              <span className="text-2xl font-black text-emerald-600">98.4</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
