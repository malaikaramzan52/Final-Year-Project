import React, { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Shuffle,
  ShoppingBag,
  BarChart3,
  LogOut,
  Menu,
  Bell,
  Search,
  ShieldCheck,
  Tag,
  MessageSquare,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../redux/reducers/user";
import { toast } from "react-toastify";
import api from "../../api/axios";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Manage Users", path: "/admin/users", icon: Users },
  { label: "Manage Books", path: "/admin/books", icon: BookOpen },
  { label: "Manage Categories", path: "/admin/categories", icon: Tag },
  { label: "Exchange Requests", path: "/admin/exchange-requests", icon: Shuffle },
  { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { label: "Complaints", path: "/admin/complaints", icon: MessageSquare },
  { label: "My Profile", path: "/admin/profile", icon: ShieldCheck },
];


const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchPendingComplaints = async () => {
      try {
        const res = await api.get("/v2/complaint/admin-all-complaints");
        const pending = res.data.complaints.filter(c => c.status === "Pending");
        setPendingComplaints(pending);
      } catch (err) {
        console.error("Failed to fetch complaints count");
      }
    };
    fetchPendingComplaints();
    const interval = setInterval(fetchPendingComplaints, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const activePath = useMemo(() => {
    // Find the longest matching path to avoid partial matches (e.g. /admin vs /admin/users)
    const sortedItems = [...navItems].sort((a, b) => b.path.length - a.path.length);
    const match = sortedItems.find((item) => {
      if (item.exact) return location.pathname === item.path;
      return location.pathname.startsWith(item.path);
    });
    return match ? match.path : "/admin";
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.get("/v2/user/logout");
      dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
      toast.success("Admin logged out!");
      window.location.reload();
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fb] flex text-gray-800 transition-all duration-300 overflow-hidden">
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 bg-white border-r border-gray-100 shadow-xl transition-all duration-300 ease-in-out scrollbar-hide
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ${sidebarCollapsed ? "w-20" : "w-72"}`}
      >
        <div className={`flex items-center h-16 border-b border-gray-100 px-6 ${sidebarCollapsed ? "justify-center px-0" : "gap-3"}`}>
          <div className="w-10 h-10 rounded-xl bg-[#D98C00] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-lg shadow-[#D98C00]/20">
            RB
          </div>
          {!sidebarCollapsed && (
            <div className="animate-in fade-in duration-500">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">ReBook</p>
              <h1 className="text-base font-black tracking-tight leading-none">Admin Panel</h1>
            </div>
          )}
        </div>

        <nav className="py-4 px-3 space-y-1 overflow-y-auto h-[calc(100vh-130px)] scrollbar-hide">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = activePath === path;
            return (
              <button
                key={path}
                onClick={() => goTo(path)}
                title={sidebarCollapsed ? label : ""}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative group
                  ${isActive ? "bg-[#D98C00] text-white shadow-lg shadow-[#D98C00]/30" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                  ${sidebarCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon size={sidebarCollapsed ? 22 : 18} />
                {!sidebarCollapsed && <span className="truncate">{label}</span>}
                {sidebarCollapsed && !isActive && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50">
                    {label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 w-full p-3 border-t border-gray-100 bg-white">
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? "Logout" : ""}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all
              ${sidebarCollapsed ? "justify-center px-0" : ""}`}
          >
            <LogOut size={sidebarCollapsed ? 22 : 18} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Desktop Collapse Toggle */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-4 top-20 w-8 h-8 bg-white border border-gray-100 rounded-full items-center justify-center shadow-md hover:scale-110 transition-transform z-40 text-[#D98C00]"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* Main Container */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-100 px-4 lg:px-6 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Deep search dashboard..."
                className="pl-9 pr-4 py-2 w-72 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#D98C00] focus:ring-4 focus:ring-[#D98C00]/5 text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 relative transition-colors"
              >
                <Bell size={20} />
                {pendingComplaints.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 scrollbar-hide">
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Alerts Center</h3>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-rose-50 text-rose-600 rounded-lg">
                      {pendingComplaints.length} NEW
                    </span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                    {pendingComplaints.length > 0 ? (
                      pendingComplaints.map((c) => (
                        <div key={c._id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => { navigate("/admin/complaints"); setShowNotifications(false); }}>
                          <div className="flex gap-4">
                            <div className="mt-1 w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                              <MessageSquare size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{c.title}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Category: {c.category}</p>
                              <div className="flex items-center gap-1 text-[10px] text-[#D98C00] font-black uppercase mt-2">
                                Audit details <ArrowRight size={10} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-16 text-center">
                        <div className="inline-flex p-4 bg-gray-50 text-gray-300 rounded-2xl mb-4">
                          <Bell size={32} />
                        </div>
                        <p className="text-sm font-bold text-gray-400">System is quiet</p>
                      </div>
                    )}
                  </div>
                  {pendingComplaints.length > 0 && (
                    <button 
                      onClick={() => { navigate("/admin/complaints"); setShowNotifications(false); }}
                      className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-50/50 hover:bg-gray-50 hover:text-[#D98C00] transition-all border-t border-gray-100"
                    >
                      View Intelligence Hub
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 text-white rounded-2xl shadow-lg shadow-gray-200">
              <div className="w-8 h-8 rounded-lg bg-[#D98C00] flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1 text-white/50">Administrator</p>
                <p className="text-xs font-black leading-none">{user?.name || "Root Admin"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
