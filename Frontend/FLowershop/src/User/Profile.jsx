
import { useEffect, useState } from "react";
import axiosInstance from "../Api/axiosInstance";


export default function Profile() {
  const [profile, setProfile] = useState({ username: "", email: "", date_joined: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("user/profile/")
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    const payload = {
      username: profile.username,
      email: profile.email,
    };
    if (profile.password) {
      payload.password = profile.password;
    }

    axiosInstance
      .put("user/profile/update/", payload)
      .then(() => {
        setMessage("Profile updated successfully!");
        setProfile((prev) => ({ ...prev, password: "" }));
      })
      .catch(() => setMessage("Error updating profile"));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-10 max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      {message && <p className="text-green-600 mb-2">{message}</p>}

      <form onSubmit={handleUpdate}>
        {/* Username */}
        <div className="mb-3">
          <label className="block mb-1">Username</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Joined Date (Read Only) */}
        <div className="mb-3">
          <label className="block mb-1">Joined On</label>
          <input
            type="text"
            value={profile.date_joined}
            disabled
            className="border bg-gray-100 p-2 w-full rounded"
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block mb-1">New Password (optional)</label>
          <input
            type="password"
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            className="border p-2 w-full rounded"
          />
        </div>

        <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
          Update Profile
        </button>
      </form>
    </div>
  );
}
