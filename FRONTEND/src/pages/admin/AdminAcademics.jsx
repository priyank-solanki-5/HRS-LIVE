import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const AdminAcademics = () => {
  const emptyForm = {
    firstName: '', middleName: '', lastName: '', gender: '', dateOfBirth: '', age: '',
    religion: '', caste: '', category: '', aadhaarNumber: '', mobileNumber: '', alternateMobileNumber: '',
    email: '', permanentAddress: '', correspondenceAddress: '', city: '', state: '', pinCode: '',
    fatherName: '', fatherOccupation: '', fatherMobileNumber: '', motherName: '', motherOccupation: '',
    motherMobileNumber: '', guardianName: '', annualFamilyIncome: ''
  }

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [viewingDetails, setViewingDetails] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true); setError('')
    try {
      const { data } = await axios.get('/admissions')
      if (!data.success) throw new Error(data.message || 'Failed to fetch students')
      setRows(data.data || [])
    } catch (err) { setError(err.response?.data?.message || err.message || 'Failed to fetch students') } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setViewingDetails(null)
  }

  const mapRowToForm = (row = {}) => ({
    firstName: row.firstName || '',
    middleName: row.middleName || '',
    lastName: row.lastName || '',
    gender: row.gender || '',
    dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth).toISOString().split('T')[0] : '',
    age: row.age?.toString() || '',
    religion: row.religion || '',
    caste: row.caste || '',
    category: row.category || '',
    aadhaarNumber: row.aadhaarNumber || '',
    mobileNumber: row.mobileNumber || '',
    alternateMobileNumber: row.alternateMobileNumber || '',
    email: row.email || '',
    permanentAddress: row.permanentAddress || '',
    correspondenceAddress: row.correspondenceAddress || '',
    city: row.city || '',
    state: row.state || '',
    pinCode: row.pinCode || '',
    fatherName: row.fatherName || '',
    fatherOccupation: row.fatherOccupation || '',
    fatherMobileNumber: row.fatherMobileNumber || '',
    motherName: row.motherName || '',
    motherOccupation: row.motherOccupation || '',
    motherMobileNumber: row.motherMobileNumber || '',
    guardianName: row.guardianName || '',
    annualFamilyIncome: row.annualFamilyIncome || ''
  })

  const startEdit = (row) => {
    setEditingId(row._id)
    setForm(mapRowToForm(row))
    setViewingDetails(null)
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {}
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this student application?')) return
    try {
      const { data } = await axios.delete(`/admissions/${id}`)
      if (!data.success) throw new Error(data.message || 'Failed to delete')
      if (editingId === id) resetForm()
      load()
    } catch (err) { alert(err.response?.data?.message || err.message || 'Failed to delete') }
  }

  const onSave = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.put(`/admissions/${editingId}`, form)
      if (!data.success) throw new Error(data.message || 'Failed to update')
      resetForm()
      load()
    } catch (err) { alert(err.response?.data?.message || err.message || 'Failed to update') }
  }

  const update = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (name === 'dateOfBirth' && value) {
      const dob = new Date(value)
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--
      setForm((f) => ({ ...f, age: age.toString() }))
    }
  }

  const getFullName = (row) => {
    const parts = [row.firstName, row.middleName, row.lastName].filter(Boolean)
    return parts.join(' ') || 'N/A'
  }

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Student Admissions</h1>
      </header>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {/* Edit Form */}
      {editingId && (
        <form onSubmit={onSave} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Edit Student Information</h3>
            <button type="button" onClick={resetForm} className="text-sm text-slate-600 hover:text-slate-900">Cancel</button>
          </div>

          {/* Personal Information */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="font-semibold text-slate-900 mb-4">Personal Information</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">First Name</label>
                <input name="firstName" value={form.firstName} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Middle Name</label>
                <input name="middleName" value={form.middleName} onChange={update} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gender</label>
                <select name="gender" value={form.gender} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Age</label>
                <input type="number" name="age" value={form.age} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Religion</label>
                <input name="religion" value={form.religion} onChange={update} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Caste</label>
                <input name="caste" value={form.caste} onChange={update} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
                <select name="category" value={form.category} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                  <option value="">Select</option>
                  <option value="General">General</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OBC">OBC</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
              <div className="sm:col-span-3"><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Aadhaar Number</label>
                <input name="aadhaarNumber" value={form.aadhaarNumber} onChange={update} maxLength="12" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="font-semibold text-slate-900 mb-4">Contact Information</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mobile Number</label>
                <input type="tel" name="mobileNumber" value={form.mobileNumber} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Alternate Mobile</label>
                <input type="tel" name="alternateMobileNumber" value={form.alternateMobileNumber} onChange={update} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
                <input type="email" name="email" value={form.email} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="font-semibold text-slate-900 mb-4">Address Information</h4>
            <div className="grid gap-4">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Permanent Address</label>
                <textarea name="permanentAddress" rows="2" value={form.permanentAddress} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Correspondence Address</label>
                <textarea name="correspondenceAddress" rows="2" value={form.correspondenceAddress} onChange={update} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">City</label>
                  <input name="city" value={form.city} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">State</label>
                  <input name="state" value={form.state} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pin Code</label>
                  <input name="pinCode" value={form.pinCode} onChange={update} required maxLength="6" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Father's Information */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="font-semibold text-slate-900 mb-4">Father's Information</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Father's Name</label>
                <input name="fatherName" value={form.fatherName} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Occupation</label>
                <input name="fatherOccupation" value={form.fatherOccupation} onChange={update} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mobile Number</label>
                <input type="tel" name="fatherMobileNumber" value={form.fatherMobileNumber} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Mother's Information */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="font-semibold text-slate-900 mb-4">Mother's Information</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mother's Name</label>
                <input name="motherName" value={form.motherName} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Occupation</label>
                <input name="motherOccupation" value={form.motherOccupation} onChange={update} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mobile Number</label>
                <input type="tel" name="motherMobileNumber" value={form.motherMobileNumber} onChange={update} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="font-semibold text-slate-900 mb-4">Additional Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Guardian Name</label>
                <input name="guardianName" value={form.guardianName} onChange={update} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Annual Family Income</label>
                <input name="annualFamilyIncome" value={form.annualFamilyIncome} onChange={update} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button type="button" onClick={resetForm} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">Save Changes</button>
          </div>
        </form>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl border border-slate-200">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Student Name</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Gender</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Age</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Category</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Email</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Mobile</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">City</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Applied On</th>
                <th className="px-3 lg:px-4 xl:px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td className="px-6 py-6 text-center" colSpan={9}>Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td className="px-6 py-6 text-center" colSpan={9}>No applications yet</td></tr>
              ) : rows.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setViewingDetails(r)}>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4 font-medium text-slate-900">{getFullName(r)}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4">{r.gender || 'N/A'}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4">{r.age || 'N/A'}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4">{r.category || 'N/A'}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4 text-xs lg:text-sm">{r.email || 'N/A'}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4">{r.mobileNumber || 'N/A'}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4">{r.city || 'N/A'}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4 text-slate-500 text-xs lg:text-sm">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-3 lg:px-4 xl:px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1.5">
                      <button onClick={() => startEdit(r)} className="rounded-full border border-slate-200 px-2 lg:px-3 py-1 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600">Edit</button>
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
                <h3 className="font-semibold text-slate-900 text-base">{getFullName(r)}</h3>
                <p className="text-sm text-slate-600 mt-1">{r.email || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Gender</p>
                  <p className="mt-1 text-slate-900">{r.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Age</p>
                  <p className="mt-1 text-slate-900">{r.age || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Category</p>
                  <p className="mt-1 text-slate-900">{r.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Mobile</p>
                  <p className="mt-1 text-slate-900">{r.mobileNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                <p className="text-xs text-slate-500">Applied: {new Date(r.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(r)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600">Edit</button>
                  <button onClick={() => onDelete(r._id)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:border-rose-200">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Details Modal */}
      {viewingDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewingDetails(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-semibold text-slate-900">Student Details</h3>
              <button onClick={() => setViewingDetails(null)} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{getFullName(viewingDetails)}</p>
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gender</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.gender || 'N/A'}</p>
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date of Birth</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.dateOfBirth ? new Date(viewingDetails.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Age</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.age || 'N/A'}</p>
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.category || 'N/A'}</p>
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
                  <p className="mt-2 text-sm font-medium text-slate-900 break-all">{viewingDetails.email || 'N/A'}</p>
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mobile Number</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.mobileNumber || 'N/A'}</p>
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">City</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.city || 'N/A'}</p>
                </div>
                <div className="sm:col-span-2"><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Permanent Address</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.permanentAddress || 'N/A'}</p>
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Father's Name</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.fatherName || 'N/A'}</p>
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Father's Mobile</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.fatherMobileNumber || 'N/A'}</p>
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mother's Name</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.motherName || 'N/A'}</p>
                </div>
                <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mother's Mobile</label>
                  <p className="mt-2 text-sm font-medium text-slate-900">{viewingDetails.motherMobileNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-200">
                <button onClick={() => { startEdit(viewingDetails); setViewingDetails(null); }} className="flex-1 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100">Edit Student</button>
                <button onClick={() => { setViewingDetails(null); onDelete(viewingDetails._id); }} className="flex-1 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100">Delete Application</button>
                <button onClick={() => setViewingDetails(null)} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAcademics;
