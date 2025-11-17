import React, { useEffect, useMemo, useState } from 'react';
import axios from '../../utils/axios';

const AdminAdmissions = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [viewingDetails, setViewingDetails] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', className: '', motherMobileNumber: '', fatherMobileNumber: '', permanentAddress: '' })

  const columns = useMemo(() => [
    { key: 'name', label: 'Student' },
    { key: 'email', label: 'Email' },
    { key: 'className', label: 'Class' },
    { key: 'motherMobile', label: 'Mother Mobile' },
    { key: 'fatherMobile', label: 'Father Mobile' },
    { key: 'address', label: 'Address' },
    { key: 'actions', label: 'Actions' },
  ], [])

  const load = async () => {
    setLoading(true); setError('')
    try {
      const { data } = await axios.get('/admissions')
      if (!data.success) throw new Error(data.message || 'Failed to fetch')
      setRows(data.data || [])
    } catch (err) { setError(err.response?.data?.message || err.message || 'Failed to fetch') } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const onEdit = (row) => { setEditing(row._id); setForm(row) }
  const onCancel = () => { setEditing(null); setForm({ firstName: '', lastName: '', email: '', className: '', motherMobileNumber: '', fatherMobileNumber: '', permanentAddress: '' }) }

  const onSave = async () => {
    try {
      const { data } = await axios.put(`/admissions/${editing}`, form)
      if (!data.success) throw new Error(data.message || 'Failed to update')
      onCancel(); load()
    } catch (err) { alert(err.response?.data?.message || err.message || 'Failed to update') }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this application?')) return
    try {
      const { data } = await axios.delete(`/admissions/${id}`)
      if (!data.success) throw new Error(data.message || 'Failed to delete')
      load()
    } catch (err) { alert(err.response?.data?.message || err.message || 'Failed to delete') }
  }

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <header className="space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Admissions</h2>
        <p className="text-xs sm:text-sm text-slate-600">All student applications</p>
      </header>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl border border-slate-200">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Student</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Email</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Class</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Mother Mobile</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Father Mobile</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Address</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td className="px-6 py-6 text-center" colSpan={6}>Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td className="px-6 py-6 text-center" colSpan={6}>No applications yet</td></tr>
              ) : rows.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setViewingDetails(r)}>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4 font-medium text-slate-900">{r.firstName} {r.lastName}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4 text-xs lg:text-sm">{r.email}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4">{r.className || 'N/A'}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4">{r.motherMobileNumber || 'N/A'}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4">{r.fatherMobileNumber || 'N/A'}</td>
                  <td className="px-3 lg:px-4 xl:px-6 py-4 max-w-[200px] lg:max-w-xs">
                    <div className="truncate" title={r.permanentAddress || ''}>{r.permanentAddress || 'N/A'}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1.5 lg:gap-2">
                      <button onClick={() => { setViewingDetails(r); setEditing(r._id); setForm(r) }} className="rounded-full border border-slate-200 px-2 lg:px-3 py-1 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600">Edit</button>
                      <button onClick={() => onDelete(r._id)} className="rounded-full border border-slate-200 px-2 lg:px-3 py-1 text-xs font-semibold text-rose-600 hover:border-rose-200">Delete</button>
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
        ) : rows.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No applications yet</div>
        ) : rows.map((r) => (
          <div key={r._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm cursor-pointer hover:border-indigo-200 transition-colors" onClick={() => setViewingDetails(r)}>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">{r.firstName} {r.lastName}</h3>
                <p className="text-sm text-slate-600 mt-1">{r.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Mother Mobile</p>
                  <p className="mt-1 text-slate-900">{r.motherMobileNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Father Mobile</p>
                  <p className="mt-1 text-slate-900">{r.fatherMobileNumber || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Class</p>
                <p className="mt-1 text-sm text-slate-900">{r.className || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Address</p>
                <p className="mt-1 text-sm text-slate-900 line-clamp-2">{r.permanentAddress || 'N/A'}</p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => { setViewingDetails(r); setEditing(r._id); setForm(r) }} className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600">Edit</button>
                <button onClick={() => onDelete(r._id)} className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:border-rose-200">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Details Modal */}
      {viewingDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewingDetails(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-semibold text-slate-900">Student Details</h3>
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
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">First Name</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.firstName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Last Name</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.lastName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Class</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.className || 'N/A'}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
                  <p className="mt-2 text-sm font-medium text-slate-900 break-all">{viewingDetails.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mother Mobile</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.motherMobileNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Father Mobile</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.fatherMobileNumber || 'N/A'}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Address</label>
                  <p className="mt-2 text-sm font-medium text-slate-900 whitespace-pre-wrap">{viewingDetails.permanentAddress || 'N/A'}</p>
                </div>
                {viewingDetails.createdAt && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Applied On</label>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {new Date(viewingDetails.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
                {viewingDetails._id && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Application ID</label>
                    <p className="mt-2 text-xs font-mono text-slate-600 break-all">{viewingDetails._id}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setEditing(viewingDetails._id);
                    setForm(viewingDetails);
                    setViewingDetails(null);
                  }}
                  className="flex-1 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => {
                    setViewingDetails(null);
                    onDelete(viewingDetails._id);
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

      {editing && (
        <div className="rounded-2xl border border-slate-200 p-4 sm:p-6 bg-white shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">Edit Application</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">First Name</label>
              <input value={form.firstName} onChange={(e)=>setForm({...form, firstName:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Last Name</label>
              <input value={form.lastName} onChange={(e)=>setForm({...form, lastName:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
              <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Class</label>
              <select value={form.className || ''} onChange={(e)=>setForm({...form, className:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                <option value="">Select Class</option>
                <option value="Pre-Primary">Pre-Primary</option>
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
                <option value="5th">5th</option>
                <option value="6th">6th</option>
                <option value="7th">7th</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
                <option value="11th">11th</option>
                <option value="12th">12th</option>
              </select>
            </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mother Mobile</label>
                  <input value={form.motherMobileNumber || ''} onChange={(e)=>setForm({...form, motherMobileNumber:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Father Mobile</label>
                  <input value={form.fatherMobileNumber || ''} onChange={(e)=>setForm({...form, fatherMobileNumber:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Address</label>
                  <textarea rows="3" value={form.permanentAddress || ''} onChange={(e)=>setForm({...form, permanentAddress:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
                </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
            <button onClick={onCancel} className="w-full sm:w-auto rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={onSave} className="w-full sm:w-auto rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdmissions;