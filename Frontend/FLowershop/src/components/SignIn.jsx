

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import FacebookSignInButton from "../components/FacebookSignInButton";
import axios from "axios";

const SignIn = () => {
  const { login, setUser, setIsAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(username, password);
      if (user) {
        navigate("/");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Invalid username or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      const id_token = credentialResponse?.credential;
      if (!id_token) {
        setError("Failed to get Google credentials");
        return;
      }

      const res = await axios.post("http://127.0.0.1:8000/api/google-login/", {
        id_token,
      });

      const { access, refresh, user } = res.data;

      // Store tokens in localStorage
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("is_admin", user.is_admin);

      // Update auth context immediately
      setUser(user);
      setIsAuthenticated(true);

      console.log("✅ Google Login Success:", user);

      // Navigate after state update
      setTimeout(() => navigate("/"), 100);
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Google login failed";
      console.error("❌ Google login error:", err.response?.data || err.message);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-tr from-pink-400 to-orange-300 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-lg rounded-3xl w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Form Section */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-pink-500 sm:text-4xl">
              Welcome Back 👋
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-black hover:underline"
              >
                Create one
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 w-full border px-3 py-2 rounded-md"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-base font-medium text-gray-900">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full border px-3 py-2 rounded-md"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <p
                  className="text-red-500 text-center font-medium"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-md bg-yellow-400 px-3.5 py-2.5 font-semibold text-black hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}{" "}
                <ArrowRight className="ml-2" size={16} />
              </button>
            </form>

            {/* Divider */}
            <div className="mt-4 flex items-center">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-3 text-xs text-gray-500">or try</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>

            {/* Social Login Buttons */}
            <div className="mt-4 flex flex-col gap-3">
              {/* Google Login */}
              <div className="flex justify-center">
                <GoogleLogin
                  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                  onSuccess={handleGoogleLogin}
                  onError={() => setError("Google Login Failed")}
                />
              </div>

              {/* Facebook Login */}
              <div className="flex justify-center">
                <FacebookSignInButton
                  onAuth={(data) => {
                    // update auth context AND localStorage so Navbar updates immediately
                    if (data?.user) {
                      localStorage.setItem("user", JSON.stringify(data.user));
                      localStorage.setItem("access", data.access);
                      localStorage.setItem("refresh", data.refresh);
                      localStorage.setItem("is_admin", data.user.is_admin);
                      // if your AuthContext exposes setUser/setIsAuthenticated:
                      setUser?.(data.user);
                      setIsAuthenticated?.(true);
                    }
                    navigate("/");
                  }}
                  setError={setError}
                />
              </div>
            </div>


          </div>
        </div>

        {/* Right Image Section */}
        <div className="hidden lg:flex items-center justify-center bg-white">
          <img
            src="https://i.pinimg.com/736x/11/8d/b8/118db877ab933ac7d81ca27feb9804ff.jpg"
            className="object-cover w-full h-full max-h-[650px]"
            alt="Illustration"
          />
        </div>
      </div>
    </section>
  );
};

export default SignIn;