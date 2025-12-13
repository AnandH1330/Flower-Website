import { Outlet, NavLink, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard | Flowershop";
  }, []);

  if (location.pathname === "/admin") {
    return <Navigate to="/admin/overview" replace />;
  }

  const linkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${isActive
      ? "bg-pink-100 text-pink-700"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 relative">
      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-20 md:hidden bg-pink-500 text-white p-2 rounded-lg shadow-md"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen md:h-auto w-64 bg-white border-r border-gray-200 p-6 shadow-lg transform transition-transform duration-300 z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ top: "70px" }} // 👈 Keeps sidebar below main navbar
      >
        <h2 className=" mt-10 text-2xl font-bold text-pink-600 mb-6">
          Flowershop Admin
        </h2>
        <nav className="flex flex-col gap-2">
          <NavLink to="/admin/products" className={linkClasses}>
            <i className="fas fa-box"></i> Products
          </NavLink>
          <NavLink to="/admin/categories" className={linkClasses}>
            <i className="fas fa-sitemap"></i> Categories
          </NavLink>
          <NavLink to="/admin/overview" className={linkClasses}>
            <i className="fas fa-chart-line"></i> Overview
          </NavLink>
          <NavLink to="/admin/orders" className={linkClasses}>
            <i className="fas fa-receipt"></i> Orders
          </NavLink>
          <NavLink to="/admin/users" className={linkClasses}>
            <i className="fas fa-users"></i> Users
          </NavLink>
          <NavLink to="/admin/contacts" className={linkClasses}>
            <i className="fas fa-envelope"></i> Contact Messages
          </NavLink>
          <NavLink to="/admin/coupons" className={linkClasses}>
            <i className="fas fa-ticket-alt"></i> Coupons
          </NavLink>
          <NavLink to="/admin/reports" className={linkClasses}>
            <i className="fas fa-file-alt"></i> Reports
          </NavLink>
          <NavLink to="/admin/notifications" className={linkClasses}>
            <i className="fas fa-bell"></i> Notifications
          </NavLink>
          <NavLink to="/admin/settings" className={linkClasses}>
            <i className="fas fa-cog"></i> Settings
          </NavLink>
          {/* 🔥 LOGOUT BUTTON HERE */}
          <button
            onClick={() => {
              localStorage.removeItem("access");
              localStorage.removeItem("refresh");
              window.location.href = "/signin";
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 text-red-600 hover:bg-red-100"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 p-6 md:ml-45 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
