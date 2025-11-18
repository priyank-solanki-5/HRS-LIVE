import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { clearAuth } from '../../utils/cookies';

const sidebarItems = [
  { label: 'Home', to: '/admin/dashboard/home', tag: 'HM' },
  { label: 'Academics', to: '/admin/dashboard/academics', tag: 'AC' },
  { label: 'Activities', to: '/admin/dashboard/activities', tag: 'AT' },
  { label: 'Career', to: '/admin/dashboard/career', tag: 'CR' },
  { label: 'Employees', to: '/admin/dashboard/employees', tag: 'EM' },
  { label: 'Upcoming Events', to: '/admin/dashboard/events', tag: 'EV' },
  { label: 'Parents', to: '/admin/dashboard/parents', tag: 'PT' },
  { label: 'Contact Us', to: '/admin/dashboard/contact', tag: 'CU' },
  { label: 'Settings', to: '/admin/dashboard/settings', tag: 'ST' },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Call backend logout to clear cookies
      await axios.post('/admin/logout');
    } catch {}
    clearAuth()
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 shadow-sm sticky top-[60px] z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-10 gap-4 lg:gap-8 min-w-0">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 lg:top-8 left-0 z-50 lg:z-auto
            w-72 shrink-0 h-full lg:h-auto
            rounded-0 lg:rounded-3xl
            bg-gradient-to-b from-[#1a1568] via-[#120E5B] to-[#0d0a47]
            text-white shadow-xl
            transform transition-transform duration-300 ease-in-out
            lg:transform-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            flex flex-col
            max-h-screen lg:max-h-[calc(100vh-4rem)]
            overflow-y-auto hide-scrollbar
          `}
        >
          <nav className="px-5 pt-6 pb-6 space-y-2 flex-1">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold transition-all',
                    isActive ? 'bg-white text-[#120E5B] shadow-lg' : 'text-white/90 hover:bg-white/10',
                  ].join(' ')
                }
              >
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-xs font-semibold tracking-wide ${
                    'text-white'
                  }`}
                >
                  {item.tag}
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto px-6 pb-8 pt-4 text-sm text-white/80">
            <p className="text-xs uppercase tracking-wide text-white/70">Quick Tips</p>
            <p className="mt-2 leading-relaxed text-white/80">
              Keep events, academic updates, and job postings fresh to engage your school community every day.
            </p>
            <button
              onClick={handleLogout}
              className="mt-4 w-full rounded-2xl border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-white/15 transition-colors"
            >
              Log Out
            </button>
          </div>
        </aside>

        <section className="flex-1 w-full lg:w-auto min-w-0">
          <div className="h-full rounded-2xl lg:rounded-3xl border border-slate-200 bg-white shadow-lg p-4 sm:p-6 lg:p-10 min-w-0 overflow-hidden">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;