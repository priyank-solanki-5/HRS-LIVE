import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const AdminHome = () => {
  const [form, setForm] = useState({ years: '', teachers: '', students: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setFetching(true);
      setError('');
      try {
        const { data } = await axios.get('/home-stats');
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch stats');
        }
        if (data.data) {
          setForm({
            years: data.data.years || '',
            teachers: data.data.teachers || '',
            students: data.data.students || '',
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch stats');
      } finally {
        setFetching(false);
      }
    };
    loadStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { data } = await axios.put('/home-stats', form);
      if (!data.success) {
        throw new Error(data.message || 'Failed to update stats');
      }
      setSuccess('Statistics updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <header>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Home Statistics</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage the statistics displayed on the home page (Years, Teachers, Students)
        </p>
      </header>

      {fetching ? (
        <div className="text-center py-8 text-slate-500">Loading statistics...</div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">{success}</div>
          )}

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Years
              </label>
              <input
                type="text"
                required
                value={form.years}
                onChange={(e) => setForm({ ...form, years: e.target.value })}
                placeholder="e.g., 24"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <p className="mt-1 text-xs text-slate-500">Number of years the school has been operating</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Teachers
              </label>
              <input
                type="text"
                required
                value={form.teachers}
                onChange={(e) => setForm({ ...form, teachers: e.target.value })}
                placeholder="e.g., 29"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <p className="mt-1 text-xs text-slate-500">Total number of teachers</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Students
              </label>
              <input
                type="text"
                required
                value={form.students}
                onChange={(e) => setForm({ ...form, students: e.target.value })}
                placeholder="e.g., 1500"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <p className="mt-1 text-xs text-slate-500">Total number of students</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Statistics'}
            </button>
          </div>
        </form>
      )}

      {/* Preview Section */}
      {!fetching && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center justify-center">
              <div className="w-40 h-40 rounded-full border-4 border-blue-900 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-blue-900">{form.years || '0'}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">Years</h4>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-40 h-40 rounded-full border-4 border-blue-900 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-blue-900">{form.teachers || '0'}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">Teachers</h4>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-40 h-40 rounded-full border-4 border-blue-900 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-blue-900">{form.students || '0'}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">Students</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;

