import { useState } from "react";
import toast from "react-hot-toast";
import Profile from "./Profile";
import Orders from "./Orders";
import Wishlist from "./Wishlist";
import Notifications from "./Notifications";
import Addresses from "./Addresses";
import Settings from "./Settings";

export default function UserDashboard() {
  const [activePage, setActivePage] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "orders":
        return <Orders />;
      case "wishlist":
        return <Wishlist />;
      case "notifications":
        return <Notifications />;
      case "addresses":
        return <Addresses />;
      case "settings":
        return <Settings />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-30 md:hidden bg-pink-500 text-white p-2 rounded-lg shadow-lg"
      >
        <i className="fas fa-bars text-lg"></i>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-[70px] left-0 h-screen md:h-auto w-64 bg-white shadow-xl 
        transform transition-transform duration-300 z-40 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-2xl font-semibold text-center py-4 border-b bg-pink-100">
          User Dashboard
        </h2>

        <ul className="p-4 space-y-2">

          {/* PROFILE */}
          <li>
            <button
              onClick={() => { setActivePage("profile"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition text-left
              ${activePage === "profile" ? "bg-pink-500 text-white" : "hover:bg-pink-100"}`}
            >
              <i className="fas fa-user"></i> Profile
            </button>
          </li>

          {/* ORDERS */}
          <li>
            <button
              onClick={() => { setActivePage("orders"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition text-left
              ${activePage === "orders" ? "bg-pink-500 text-white" : "hover:bg-pink-100"}`}
            >
              <i className="fas fa-box"></i> My Orders
            </button>
          </li>

          {/* WISHLIST */}
          <li>
            <button
              onClick={() => { setActivePage("wishlist"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition text-left
              ${activePage === "wishlist" ? "bg-pink-500 text-white" : "hover:bg-pink-100"}`}
            >
              <i className="fas fa-heart"></i> Wishlist
            </button>
          </li>

          {/* ADDRESSES */}
          <li>
            <button
              onClick={() => { setActivePage("addresses"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition text-left
              ${activePage === "addresses" ? "bg-pink-500 text-white" : "hover:bg-pink-100"}`}
            >
              <i className="fas fa-map-marker-alt"></i> My Addresses
            </button>
          </li>

          {/* NOTIFICATIONS */}
          <li>
            <button
              onClick={() => { setActivePage("notifications"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition text-left
              ${activePage === "notifications" ? "bg-pink-500 text-white" : "hover:bg-pink-100"}`}
            >
              <i className="fas fa-bell"></i> Notifications
            </button>
          </li>

          {/* SETTINGS */}
          <li>
            <button
              onClick={() => { setActivePage("settings"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition text-left
              ${activePage === "settings" ? "bg-pink-500 text-white" : "hover:bg-pink-100"}`}
            >
              <i className="fas fa-cog"></i> Settings
            </button>
          </li>
          {/* LOGOUT */}
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                toast.success("Logged out successfully!");

                setTimeout(() => {
                  window.location.href = "/signin";
                }, 1000); // small delay so toast shows
              }}
              className="w-full flex items-center gap-3 p-2 rounded-lg transition text-left 
    text-red-600 hover:bg-red-100"
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </li>

        </ul>
      </div>

      {/* Background overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-40 z-20 md:hidden"
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:ml-64">{renderPage()}</div>
    </div>
  );
}
