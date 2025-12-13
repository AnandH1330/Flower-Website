// import { useMemo, useState } from "react";

// function UsersTable({ users, onEdit, onDelete }) {
//   return (
//     <table className="w-full border-collapse text-sm">
//       <thead>
//         <tr className="bg-pink-50 text-gray-700">
//           <th className="text-left p-3 border-b">Name</th>
//           <th className="text-left p-3 border-b">Email</th>
//           <th className="text-left p-3 border-b">Role</th>
//           <th className="text-right p-3 border-b">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {users.map((u) => (
//           <tr key={u.id} className="hover:bg-pink-50">
//             <td className="p-3 border-b">{u.name}</td>
//             <td className="p-3 border-b">{u.email}</td>
//             <td className="p-3 border-b capitalize">{u.role}</td>
//             <td className="p-3 border-b text-right space-x-2">
//               <button
//                 onClick={() => onEdit(u)}
//                 className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => onDelete(u.id)}
//                 className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
//               >
//                 Delete
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// function UserForm({ initial, onCancel, onSave }) {
//   const [name, setName] = useState(initial?.name || "");
//   const [email, setEmail] = useState(initial?.email || "");
//   const [role, setRole] = useState(initial?.role || "customer");

//   function handleSubmit(e) {
//     e.preventDefault();
//     onSave({
//       ...initial,
//       name: name.trim(),
//       email: email.trim(),
//       role,
//     });
//   }

//   return (
//     <form onSubmit={handleSubmit} className="grid gap-3 max-w-md">
//       <div>
//         <label className="block text-sm font-medium text-gray-600">Name</label>
//         <input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-pink-300"
//         />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-600">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-pink-300"
//         />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-600">Role</label>
//         <select
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-pink-300"
//         >
//           <option value="customer">Customer</option>
//           <option value="staff">Staff</option>
//           <option value="admin">Admin</option>
//         </select>
//       </div>
//       <div className="flex gap-2">
//         <button
//           type="submit"
//           className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
//         >
//           Save
//         </button>
//         <button
//           type="button"
//           onClick={onCancel}
//           className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }

// export default function AdminUsers() {
//   const seed = useMemo(
//     () => [
//       { id: "u1", name: "Priya Sharma", email: "priya@example.com", role: "customer" },
//       { id: "u2", name: "Arun Kumar", email: "arun@example.com", role: "staff" },
//       { id: "u3", name: "Sneha Rao", email: "sneha@example.com", role: "customer" },
//     ],
//     []
//   );

//   const [users, setUsers] = useState(seed);
//   const [filter, setFilter] = useState("");
//   const [editing, setEditing] = useState(null);
//   const [adding, setAdding] = useState(false);

//   const filtered = users.filter(
//     (u) =>
//       u.name.toLowerCase().includes(filter.toLowerCase()) ||
//       u.email.toLowerCase().includes(filter.toLowerCase())
//   );

//   const handleDelete = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));

//   const handleSave = (user) => {
//     if (user.id) {
//       setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
//     } else {
//       setUsers((prev) => [{ ...user, id: "u" + (prev.length + 1) }, ...prev]);
//     }
//     setEditing(null);
//     setAdding(false);
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex justify-between items-center">
//         <h3 className="text-xl font-semibold text-pink-600">Users</h3>
//         <button
//           onClick={() => {
//             setAdding(true);
//             setEditing(null);
//           }}
//           className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
//         >
//           Add User
//         </button>
//       </div>

//       <input
//         placeholder="Search users..."
//         value={filter}
//         onChange={(e) => setFilter(e.target.value)}
//         className="border rounded-lg px-3 py-2 w-full max-w-sm focus:ring-2 focus:ring-pink-300"
//       />

//       {(adding || editing) && (
//         <div className="bg-white border rounded-xl p-4 shadow-sm">
//           <h4 className="text-pink-600 font-semibold mb-3">
//             {editing ? "Edit User" : "Add User"}
//           </h4>
//           <UserForm
//             initial={editing}
//             onCancel={() => {
//               setAdding(false);
//               setEditing(null);
//             }}
//             onSave={handleSave}
//           />
//         </div>
//       )}

//       <div className="bg-white border rounded-xl p-4 shadow-sm overflow-x-auto">
//         <UsersTable users={filtered} onEdit={setEditing} onDelete={handleDelete} />
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function User() {
//   const [users, setUsers] = useState([]);
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");

//   // ✅ Fetch all users
//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:8000/api/getdata/")
//       .then((res) => setUsers(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   // ✅ Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ Handle registration form submit
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios
//       post("http://127.0.0.1:8000/api/register/", formData)
//       .then((res) => {
//         setMessage("User registered successfully ✅");
//         setFormData({ username: "", email: "", password: "" });

//         // Refresh user list
//         return axios.get("http://127.0.0.1:8000/api/getdata/");
//       })
//       .then((res) => setUsers(res.data))
//       .catch((err) => {
//         if (err.response && err.response.data.error) {
//           setMessage(err.response.data.error);
//         } else {
//           setMessage("Something went wrong!");
//         }
//       });
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">
//         User Management
//       </h1>

//       {/* ✅ Registration Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-lg rounded-lg p-4 mb-6"
//       >
//         <h2 className="text-lg font-semibold mb-3">Register New User</h2>
//         <div className="grid gap-3">
//           <input
//             type="text"
//             name="username"
//             placeholder="Username"
//             value={formData.username}
//             onChange={handleChange}
//             className="border p-2 rounded"
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="border p-2 rounded"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="border p-2 rounded"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="mt-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//         >
//           Register
//         </button>
//       </form>

//       {/* ✅ Feedback Message */}
//       {message && (
//         <div className="text-center mb-4 text-green-600 font-medium">
//           {message}
//         </div>
//       )}

//       {/* ✅ User List */}
//       <div className="bg-white shadow-lg rounded-lg p-4">
//         <h2 className="text-lg font-semibold mb-3">Registered Users</h2>
//         {users.length === 0 ? (
//           <p className="text-gray-500">No users found.</p>
//         ) : (
//           <ul className="divide-y divide-gray-200">
//             {users.map((user) => (
//               <li key={user.id} className="py-2">
//                 <span className="font-medium">{user.username}</span> —{" "}
//                 <span className="text-gray-600">{user.email}</span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";

const defaultForm = {
  id: null,
  username: "",
  email: "",
  password: "",
  is_staff: false,
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = () => {
    setLoading(true);
    axiosInstance
      .get("users/")
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => setForm(defaultForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      username: form.username,
      email: form.email,
      is_staff: form.is_staff,
    };
    if (form.password) {
      payload.password = form.password;
    }

    try {
      if (form.id) {
        await axiosInstance.put(`users/${form.id}/`, payload);
      } else {
        await axiosInstance.post("users/", payload);
      }
      resetForm();
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      username: user.username,
      email: user.email,
      password: "",
      is_staff: user.is_staff,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axiosInstance.delete(`users/${id}/`);
      loadUsers();
    } catch {
      setError("Unable to delete user");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-pink-600">Users</h2>
        <button
          onClick={resetForm}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
        >
          Add New
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-4 grid gap-4 md:grid-cols-2"
      >
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Username
          </label>
          <input
            value={form.username}
            onChange={(e) => setField("username", e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            placeholder={form.id ? "Leave blank to keep current" : ""}
            onChange={(e) => setField("password", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_staff}
            onChange={(e) => setField("is_staff", e.target.checked)}
          />
          <span>Admin access</span>
        </div>
        {error && <p className="text-red-500 text-sm md:col-span-2">{error}</p>}
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {form.id ? "Update User" : "Create User"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-4">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="p-4 text-gray-500">No users found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3 font-semibold">{user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">
                    {user.is_staff ? "Admin" : "Customer"}
                  </td>
                  <td className="p-3">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 text-xs rounded bg-red-100 text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
