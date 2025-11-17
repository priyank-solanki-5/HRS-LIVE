import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../utils/axios'

const AdminBar = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // Call backend logout to clear cookies
      await axios.post('/admin/logout');
    } catch {}
    navigate('/admin', { replace: true })
  }

  return (
    <div className="w-full bg-gray-100 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/admin/dashboard" className="text-lg font-bold">Dashboard</Link>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default AdminBar


