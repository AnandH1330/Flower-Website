import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Api/axiosInstance";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Fetch current user profile
  useEffect(() => {
    axiosInstance
      .get("user/profile/")
      .then((res) => {
        setUser(res.data);
        setForm({
          username: res.data.username,
          email: res.data.email,
          password: "",
        });
      })
      .catch((err) => {
        console.error("Profile load error:", err);
        if (err.response?.status === 401) {
          setMessage("Session expired. Please log in again.");
          setTimeout(() => navigate("/signin"), 2000);
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("user/profile/update/", form);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("❌ Failed to update profile. Try again.");
    }
  };

  // 🔹 Logout function
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/signin");
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10">Loading profile...</p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
        My Profile
      </h1>

      {message && (
        <p
          className={`text-center font-medium mb-4 ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700 mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-indigo-200"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Save Changes
          </button>
        </div>
      </form>

      <hr className="my-8" />

      <div className="text-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
