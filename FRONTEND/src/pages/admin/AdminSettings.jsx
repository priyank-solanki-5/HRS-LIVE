import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      try {
        const { data } = await axios.get("/admin/profile");
        if (data.success && data.data) {
          setAdminInfo(data.data);
          setFormData(prev => ({
            ...prev,
            email: data.data.email || ""
          }));
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch profile");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 5000);
    return () => clearTimeout(timer);
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.email) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    // If changing password, validate password fields
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setError("Current password is required to change password.");
        setLoading(false);
        return;
      }
      if (!formData.newPassword) {
        setError("New password is required.");
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters long.");
        setLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New password and confirm password do not match.");
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        email: formData.email
      };

      // Only include password fields if new password is provided
      if (formData.newPassword) {
        payload.password = formData.newPassword;
        payload.currentPassword = formData.currentPassword;
      }

      const { data } = await axios.put("/admin/credentials", payload);
      if (!data.success) {
        throw new Error(data.message || "Failed to update credentials");
      }

      setSuccess("Credentials updated successfully! You will be logged out. Please login with your new credentials.");
      
      // Clear form
      setFormData({
        email: formData.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Logout and redirect after 2 seconds
      setTimeout(async () => {
        try {
          await axios.post("/admin/logout");
        } catch (err) {
          console.error("Logout error:", err);
        }
        navigate("/admin", { replace: true });
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update credentials");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-6 sm:space-y-8 min-w-0">
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Settings</h2>
          <p className="text-xs sm:text-sm text-slate-600">Update your login credentials (email and password).</p>
        </div>
      </header>

      {error && <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}
      {success && <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-600">{success}</div>}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Update Login Credentials</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="admin@example.com"
            />
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Change Password (Optional)</h4>
            <p className="text-xs text-slate-500 mb-4">Leave password fields empty if you don't want to change your password.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-indigo-600 px-6 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Credentials"}
            </button>
          </div>
        </form>
      </section>

      {adminInfo && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Account Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold text-slate-600">Name:</span>{" "}
              <span className="text-slate-900">{adminInfo.name || "Administrator"}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Email:</span>{" "}
              <span className="text-slate-900">{adminInfo.email}</span>
            </div>
            {adminInfo.createdAt && (
              <div>
                <span className="font-semibold text-slate-600">Account Created:</span>{" "}
                <span className="text-slate-900">
                  {new Date(adminInfo.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminSettings;

