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
} from "lucide-react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../redux/reducers/user";
import { toast } from "react-toastify";
import api from "../../api/axios";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Manage Users", path: "/admin/users", icon: Users },
  { label: "Manage Books", path: "/admin/books", icon: BookOpen },
  { label: "Manage Categories", path: "/admin/categories", icon: Tag },
  { label: "Exchange Requests", path: "/admin/exchange-requests", icon: Shuffle },
  { label: "Buy Orders", path: "/admin/orders", icon: ShoppingBag },
  { label: "Complaints", path: "/admin/complaints", icon: MessageSquare },
  { label: "My Profile", path: "/admin/profile", icon: ShieldCheck },
  { label: "Reports", path: "/admin/reports", icon: BarChart3 },
];


const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingComplaints, 30 * 1000);
    return () => clearInterval(interval);
  }, []);



  const activePath = useMemo(() => {
    const match = navItems.find((item) => location.pathname.startsWith(item.path));
    return match ? match.path : "/admin";
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.get("/v2/user/logout");
      dispatch(logout());
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
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
    <div className="min-h-screen bg-[#f7f8fb] flex text-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-72 bg-white border-r border-gray-100 shadow-sm transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#D98C00] text-white flex items-center justify-center font-bold text-lg">
            RB
          </div>
          <div>
            <p className="text-xs text-gray-500">ReBook</p>
            <h1 className="text-lg font-bold">Admin Panel</h1>
          </div>
        </div>

        <nav className="py-4 px-3 space-y-1 overflow-y-auto h-[calc(100vh-64px)]">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = activePath === path;
            return (
              <button
                key={path}
                onClick={() => goTo(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition
                  ${isActive ? "bg-[#D98C00]/10 text-[#D98C00]" : "text-gray-700 hover:bg-gray-50"}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-100 px-4 lg:px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search in dashboard"
                className="pl-9 pr-4 py-2 w-72 rounded-lg border border-gray-200 focus:border-[#D98C00] focus:ring-2 focus:ring-[#D98C00]/30 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 relative"
              >
                <Bell size={18} />
                {pendingComplaints.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                    {pendingComplaints.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-600 rounded-full uppercase">
                      {pendingComplaints.length} New
                    </span>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {pendingComplaints.length > 0 ? (
                      pendingComplaints.map((c) => (
                        <div key={c._id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                          <div className="flex gap-3">
                            <div className="mt-1 p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                              <MessageSquare size={14} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 line-clamp-1">{c.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">Category: {c.category}</p>
                              <button 
                                onClick={() => {
                                  navigate("/admin/complaints");
                                  setShowNotifications(false);
                                }}
                                className="text-xs text-[#D98C00] font-bold mt-2 flex items-center gap-1 hover:underline"
                              >
                                View details <ArrowRight size={10} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <div className="inline-flex p-3 bg-gray-50 text-gray-400 rounded-full mb-3">
                          <Bell size={24} />
                        </div>
                        <p className="text-sm text-gray-500">No new notifications</p>
                      </div>
                    )}
                  </div>
                  {pendingComplaints.length > 0 && (
                    <button 
                      onClick={() => {
                        navigate("/admin/complaints");
                        setShowNotifications(false);
                      }}
                      className="w-full py-3 text-xs font-bold text-gray-500 bg-gray-50/50 hover:bg-gray-50 hover:text-[#D98C00] transition-colors border-t border-gray-50"
                    >
                      View All Complaints
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <ShieldCheck size={18} className="text-[#D98C00]" />
              <div>
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-semibold text-gray-800">{user?.name || "Admin"}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
