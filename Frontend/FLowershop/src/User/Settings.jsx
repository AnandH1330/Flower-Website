import { useState } from "react";
import axiosInstance from "../Api/axiosInstance";


export default function Settings() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const changePassword = () => {
    axiosInstance
      .post("user/change-password/", {
        new_password: password,
      })
      .then(() => {
        setMessage("Password updated successfully!");
        setPassword("");
      })
      .catch(() => setMessage("Failed to update password"));
  };

  return (
    <div className=" mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      <div className="space-y-3">
        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={changePassword}
          className="bg-pink-500 text-white px-4 py-2 rounded"
        >
          Update Password
        </button>

        {message && <p className="text-green-600">{message}</p>}
      </div>
    </div>
  );
}
