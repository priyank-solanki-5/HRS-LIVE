import React, { useCallback, useEffect, useState } from "react";
import axios from "../../utils/axios";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    message: "",
    status: "new"
  });

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/contacts");
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch contacts");
      }
      setContacts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (contact) => {
    setEditingId(contact._id);
    setFormData({
      name: contact.name || "",
      email: contact.email || "",
      mobileNumber: contact.mobileNumber || "",
      message: contact.message || "",
      status: contact.status || "new"
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.put(`/contacts/${editingId}`, formData);
      if (!data.success) {
        throw new Error(data.message || "Failed to update contact");
      }
      setSuccess("Contact updated successfully.");
      setEditingId(null);
      setFormData({
        name: "",
        email: "",
        mobileNumber: "",
        message: "",
        status: "new"
      });
      await loadContacts();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update contact");
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm("Delete this contact submission?")) return;
    try {
      const { data } = await axios.delete(`/contacts/${contactId}`);
      if (!data.success) {
        throw new Error(data.message || "Failed to delete contact");
      }
      if (editingId === contactId) {
        setEditingId(null);
        setFormData({
          name: "",
          email: "",
          mobileNumber: "",
          message: "",
          status: "new"
        });
      }
      await loadContacts();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete contact");
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return value;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-800",
      read: "bg-yellow-100 text-yellow-800",
      replied: "bg-green-100 text-green-800"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.new}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Contact Us</h2>
          <p className="text-xs sm:text-sm text-slate-600">View and manage contact form submissions.</p>
        </div>
      </header>

      {error && <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}
      {success && <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-600">{success}</div>}

      {editingId && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Update Contact</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: "",
                    email: "",
                    mobileNumber: "",
                    message: "",
                    status: "new"
                  });
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Update Contact
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">All Contact Submissions</h3>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Showing {contacts.length} submission{contacts.length === 1 ? "" : "s"}
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Loading contacts...
          </div>
        ) : contacts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No contact submissions yet.
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <article
                key={contact._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm hover:border-indigo-200 transition-colors"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{contact._id}</p>
                      {getStatusBadge(contact.status)}
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-slate-900">{contact.name}</h4>
                    <p className="mt-1 text-sm text-indigo-600">{contact.email}</p>
                    <p className="mt-1 text-sm text-slate-600">Phone: {contact.mobileNumber}</p>
                    <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">{contact.message}</p>
                    <p className="mt-2 text-xs text-slate-400">Submitted: {formatDate(contact.createdAt)}</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full sm:w-40">
                    <button
                      type="button"
                      onClick={() => handleEdit(contact)}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(contact._id)}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:border-rose-200"
                    >
                      Delete
                    </button>
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

export default AdminContact;

