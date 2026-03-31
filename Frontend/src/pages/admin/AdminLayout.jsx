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
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Manage Users", path: "/admin/users", icon: Users },
  { label: "Manage Books", path: "/admin/books", icon: BookOpen },
  { label: "Manage Categories", path: "/admin/categories", icon: Tag },
  { label: "Exchange Requests", path: "/admin/exchange-requests", icon: Shuffle },
  { label: "Buy Orders", path: "/admin/orders", icon: ShoppingBag },
  { label: "Reports", path: "/admin/reports", icon: BarChart3 },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activePath = useMemo(() => {
    const match = navItems.find((item) => location.pathname.startsWith(item.path));
    return match ? match.path : "/admin";
  }, [location.pathname]);

  const handleLogout = () => {
    navigate("/login", { replace: true });
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
            <button className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <ShieldCheck size={18} className="text-[#D98C00]" />
              <div>
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-semibold text-gray-800">Admin</p>
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
