
import React, { useState } from "react";
import axiosInstance from "../Api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Step 1: Register the user
      await axiosInstance.post("register/", formData);

      // Step 2: Automatically login after signup
      const loginResponse = await axiosInstance.post("token/", {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("access", loginResponse.data.access);
      localStorage.setItem("refresh", loginResponse.data.refresh);
      localStorage.setItem("username", formData.username);

      const userRes = await axiosInstance.get("user/profile/");
      const user = userRes.data;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.is_admin) {
        navigate("/admin/overview");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.username ||
        err.response?.data?.password ||
        err.response?.data?.detail ||
        "Signup failed. Try again.";

      setError(msg);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-400 to-orange-300 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-400 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/signin" className="text-pink-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;

