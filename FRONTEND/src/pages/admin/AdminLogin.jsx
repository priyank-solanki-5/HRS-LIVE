import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SectionTitle from "../../components/SectionTitle";
import { isAuthenticated, setAuthFlag, setAdminToken } from "../../utils/cookies";
import axios from "../../utils/axios";

// Backend login replaces previous hardcoded check

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirect") || "/admin/dashboard";

  useEffect(() => {
    // If already logged in, go straight to dashboard
    if (isAuthenticated()) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post('/admin/login', { email, password });
      if (!data.success) {
        throw new Error(data.message || 'Login failed')
      }
      // Token is stored in httpOnly cookie by the server (if allowed by browser)
      // We also store it in localStorage to send via Authorization header,
      // which avoids issues with blocked third-party cookies.
      if (data?.data?.token) {
        setAdminToken(data.data.token);
      }
      // Auth flag cookie needs to be accessible on the frontend domain
      setAuthFlag(true);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <SectionTitle title="Admin Login" />
        <form onSubmit={handleSubmit} className="space-y-6 mt-8 bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      </div>
    </div>
  );
};

export default AdminLogin;


