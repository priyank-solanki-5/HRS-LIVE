import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const AdminEmployees = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewingDetails, setViewingDetails] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    status: '',
    notes: ''
  });
  const [filterStatus, setFilterStatus] = useState('');

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const { data } = await axios.get('/job-applications', { params });
      if (!data.success) throw new Error(data.message || 'Failed to fetch applications');
      setApplications(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [filterStatus]);

  const handleEdit = (application) => {
    setEditing(application._id);
    setForm({
      status: application.status || 'Pending',
      notes: application.notes || ''
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ status: '', notes: '' });
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put(`/job-applications/${editing}`, form);
      if (!data.success) throw new Error(data.message || 'Failed to update');
      handleCancel();
      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    try {
      const { data } = await axios.delete(`/job-applications/${id}`);
      if (!data.success) throw new Error(data.message || 'Failed to delete');
      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Under Review': 'bg-blue-50 text-blue-700 border-blue-200',
      'Shortlisted': 'bg-purple-50 text-purple-700 border-purple-200',
      'Rejected': 'bg-red-50 text-red-700 border-red-200',
      'Hired': 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
    return colors[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return value;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Job Applications</h2>
          <p className="text-xs sm:text-sm text-slate-600">Manage candidate applications for job openings</p>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
            <option value="Hired">Hired</option>
          </select>
        </div>
      </header>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl border border-slate-200">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Candidate</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Job Position</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Email</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Phone</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Status</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Applied On</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td className="px-6 py-6 text-center" colSpan={7}>Loading...</td></tr>
              ) : applications.length === 0 ? (
                <tr><td className="px-6 py-6 text-center" colSpan={7}>No applications yet</td></tr>
              ) : applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setViewingDetails(app)}>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4 font-medium text-slate-900">
                    {app.firstName} {app.lastName}
                  </td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4">
                    {app.jobId?.title || 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4 text-xs lg:text-sm">{app.email}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4">{app.phone}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4 text-xs">{formatDate(app.createdAt)}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1.5 lg:gap-2">
                      <button
                        onClick={() => { setViewingDetails(app); handleEdit(app); }}
                        className="rounded-full border border-slate-200 px-2 lg:px-3 py-1 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="rounded-full border border-slate-200 px-2 lg:px-3 py-1 text-xs font-semibold text-rose-600 hover:border-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No applications yet</div>
        ) : applications.map((app) => (
          <div
            key={app._id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm cursor-pointer hover:border-indigo-200 transition-colors"
            onClick={() => setViewingDetails(app)}
          >
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">{app.firstName} {app.lastName}</h3>
                <p className="text-sm text-slate-600 mt-1">{app.jobId?.title || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                  <p className="mt-1 text-slate-900">{app.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Phone</p>
                  <p className="mt-1 text-slate-900">{app.phone}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
                <p className="text-xs text-slate-500">{formatDate(app.createdAt)}</p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => { setViewingDetails(app); handleEdit(app); }}
                  className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(app._id)}
                  className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:border-rose-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Details Modal */}
      {viewingDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewingDetails(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-semibold text-slate-900">Application Details</h3>
              <button
                onClick={() => setViewingDetails(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Job Position</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.jobId?.title || 'N/A'}</p>
                  <p className="text-xs text-slate-600 mt-1">{viewingDetails.jobId?.employmentType} • {viewingDetails.jobId?.location}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</label>
                  <p className="mt-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${getStatusColor(viewingDetails.status)}`}>
                      {viewingDetails.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">First Name</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.firstName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Last Name</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.lastName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
                  <p className="mt-2 text-sm font-medium text-slate-900 break-all">{viewingDetails.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.phone}</p>
                </div>
                {viewingDetails.dateOfBirth && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date of Birth</label>
                    <p className="mt-2 text-sm font-medium text-slate-900">{formatDate(viewingDetails.dateOfBirth)}</p>
                  </div>
                )}
                {viewingDetails.currentPosition && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Position</label>
                    <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.currentPosition}</p>
                  </div>
                )}
                {viewingDetails.currentCompany && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Company</label>
                    <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.currentCompany}</p>
                  </div>
                )}
                {viewingDetails.yearsOfExperience !== undefined && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Years of Experience</label>
                    <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.yearsOfExperience}</p>
                  </div>
                )}
                {viewingDetails.education && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Education</label>
                    <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.education}</p>
                  </div>
                )}
                {viewingDetails.address && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Address</label>
                    <p className="mt-2 text-sm font-medium text-slate-900 whitespace-pre-wrap">{viewingDetails.address}</p>
                  </div>
                )}
                {viewingDetails.city && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">City</label>
                    <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.city}</p>
                  </div>
                )}
                {viewingDetails.state && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">State</label>
                    <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.state}</p>
                  </div>
                )}
                {viewingDetails.skills && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Skills</label>
                    <p className="mt-2 text-sm font-medium text-slate-900 whitespace-pre-wrap">{viewingDetails.skills}</p>
                  </div>
                )}
                {viewingDetails.coverLetter && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cover Letter</label>
                    <p className="mt-2 text-sm font-medium text-slate-900 whitespace-pre-wrap">{viewingDetails.coverLetter}</p>
                  </div>
                )}
                {viewingDetails.expectedSalary && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expected Salary</label>
                    <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.expectedSalary}</p>
                  </div>
                )}
                {viewingDetails.availability && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Availability</label>
                    <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.availability}</p>
                  </div>
                )}
                {viewingDetails.notes && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Admin Notes</label>
                    <p className="mt-2 text-sm font-medium text-slate-900 whitespace-pre-wrap">{viewingDetails.notes}</p>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Applied On</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{formatDate(viewingDetails.createdAt)}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setEditing(viewingDetails._id);
                    setForm({
                      status: viewingDetails.status || 'Pending',
                      notes: viewingDetails.notes || ''
                    });
                    setViewingDetails(null);
                  }}
                  className="flex-1 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
                >
                  Edit Status
                </button>
                <button
                  onClick={() => {
                    setViewingDetails(null);
                    handleDelete(viewingDetails._id);
                  }}
                  className="flex-1 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100"
                >
                  Delete Application
                </button>
                <button
                  onClick={() => setViewingDetails(null)}
                  className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {editing && (
        <div className="rounded-2xl border border-slate-200 p-4 sm:p-6 bg-white shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">Update Application Status</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Rejected">Rejected</option>
                <option value="Hired">Hired</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Notes</label>
              <textarea
                rows="3"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Add any notes about this application..."
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
            <button
              onClick={handleCancel}
              className="w-full sm:w-auto rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;

