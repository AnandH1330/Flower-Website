
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function Setting() {
//   const [user, setUser] = useState(null);
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");

//   // 🔹 Fetch current user profile
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://127.0.0.1:8000/api/user/profile/", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUser(res.data);
//         setForm({
//           username: res.data.username || "",
//           email: res.data.email || "",
//           password: "",
//         });
//       } catch (err) {
//         console.error("Error loading user:", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   // 🔹 Handle input change
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // 🔹 Update profile
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put("http://127.0.0.1:8000/api/user/profile/update/", form, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setMessage("✅ Profile updated successfully!");
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       setMessage("❌ Failed to update profile. Try again.");
//     }
//   };

//   if (!user) {
//     return <p className="text-center mt-10 text-gray-600">Loading settings...</p>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
//       <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
//         Account Settings
//       </h1>

//       {message && (
//         <div
//           className={`text-center mb-4 font-medium ${
//             message.startsWith("✅") ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">Username</label>
//           <input
//             type="text"
//             name="username"
//             value={form.username}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-indigo-200"
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium mb-2">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-indigo-200"
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium mb-2">
//             New Password
//           </label>
//           <input
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-indigo-200"
//             placeholder="Leave blank to keep current password"
//           />
//         </div>

//         <div className="text-center">
//           <button
//             type="submit"
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
//           >
//             Save Changes
//           </button>
//         </div>
//       </form>

//       <hr className="my-8" />

//       <div className="text-center">
//         <button
//           onClick={() => {
//             localStorage.removeItem("token");
//             window.location.href = "/login";
//           }}
//           className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";


export default function Setting() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("user/profile/");
      setUser(res.data);
      setForm({
        username: res.data.username || "",
        email: res.data.email || "",
        password: "",
      });
    } catch (err) {
      console.error("Error loading user:", err);
      setMessage("❌ Failed to load profile. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("user/profile/update/", form);
      setMessage("✅ Profile updated successfully!");
      setForm((prev) => ({ ...prev, password: "" }));
      fetchUser();
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("❌ Failed to update profile. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/signin";
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Loading your settings...
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Account Settings
      </h1>

      {message && (
        <div
          className={`text-center mb-4 font-medium ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            New Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-indigo-200"
            placeholder="Leave blank to keep current password"
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
