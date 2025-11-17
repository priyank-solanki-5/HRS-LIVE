import React, { useCallback, useEffect, useState } from 'react';
import axios from '../../utils/axios';

const defaultForm = {
  title: '',
  employmentType: 'Full-Time',
  location: '',
  description: '',
  deadline: '',
  isActive: true,
};

const AdminCareer = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/jobs/admin');
      if (!data.success) {
        throw new Error(data.message || 'Failed to load jobs');
      }
      setJobs(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const toInputDate = (value) => {
    if (!value) return '';
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) {
        return typeof value === 'string' ? value.slice(0, 10) : '';
      }
      return d.toISOString().slice(0, 10);
    } catch {
      return '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      deadline: form.deadline,
    };

    try {
      const { data } = await axios[editingId ? 'put' : 'post'](
        editingId ? `/jobs/${editingId}` : '/jobs',
        payload
      );

      if (!data.success) {
        throw new Error(data.message || 'Failed to save job');
      }

      await loadJobs();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job) => {
    setShowForm(true);
    setEditingId(job._id);
    setForm({
      title: job.title || '',
      employmentType: job.employmentType || 'Full-Time',
      location: job.location || '',
      description: job.description || '',
      deadline: toInputDate(job.deadline),
      isActive: typeof job.isActive === 'boolean' ? job.isActive : true,
    });
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job posting?')) return;

    try {
      const { data } = await axios.delete(`/jobs/${jobId}`);
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete job');
      }
      if (editingId === jobId) {
        resetForm();
        setShowForm(false);
      }
      await loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete job');
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      const { data } = await axios.put(`/jobs/${job._id}`, { isActive: !job.isActive });
      if (!data.success) {
        throw new Error(data.message || 'Failed to update status');
      }
      await loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update status');
    }
  };

  const formatDate = (value) => {
    if (!value) return '—';
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return value;
    }
  };

  const activeJobs = jobs.filter((job) => job.isActive);

  return (
    <div className="space-y-6 sm:space-y-10 min-w-0">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Career Opportunities</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Publish open vacancies, track applications, and coordinate interviews with prospective candidates.
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            }
            setShowForm((value) => !value);
          }}
          className="rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-indigo-700"
        >
          {showForm ? 'Close Form' : 'Add Job'}
        </button>
      </header>

      {error && <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}

      {showForm && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            {editingId ? 'Update Job Posting' : 'Create New Job Posting'}
          </h3>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Job Title</label>
              <input
                required
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Science Lab Assistant"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 sm:px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Employment Type</label>
              <select
                value={form.employmentType}
                onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 sm:px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Location</label>
              <input
                required
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Rajkot"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 sm:px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Application Deadline</label>
              <input
                required
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 sm:px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Role Summary</label>
              <textarea
                required
                rows="4"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Outline responsibilities, expectations, and key qualifications."
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 sm:px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Mark as active</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">Current Listings</h3>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Showing {jobs.length} total / {activeJobs.length} active
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Loading job postings...
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No job postings yet. Create one to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <article
                key={job._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:border-indigo-200 transition-colors"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{job._id}</p>
                    <h4 className="mt-1 text-base sm:text-lg font-semibold text-slate-900">{job.title}</h4>
                    <p className="mt-1 text-xs font-medium text-indigo-600">
                      {job.employmentType} • {job.location}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{job.description}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        job.isActive
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <p className="text-xs text-slate-500">Deadline: {formatDate(job.deadline)}</p>
                    <p className="text-xs text-slate-400">Posted: {formatDate(job.createdAt)}</p>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleEdit(job)}
                        className="w-full sm:w-auto rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(job)}
                        className="w-full sm:w-auto rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:border-indigo-200"
                      >
                        {job.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(job._id)}
                        className="w-full sm:w-auto rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:border-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminCareer;