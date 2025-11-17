import React, { useCallback, useEffect, useState } from "react";
import axios from "../../utils/axios";

const emptyForm = {
  name: "",
  testimonial: "",
  photo: "",
};

const AdminParents = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const loadParents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/parents");
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch parent testimonials");
      }
      setParents(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch parent testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParents();
  }, [loadParents]);

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        photo: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (!formData.name || !formData.testimonial) {
      setError("Please fill in all required fields.");
      setSaving(false);
      return;
    }

    try {
      const { data } = await axios[editingId ? 'put' : 'post'](
        editingId ? `/parents/${editingId}` : "/parents",
        formData
      );
      if (!data.success) {
        throw new Error(data.message || "Failed to save parent testimonial");
      }
      setSuccess(editingId ? "Parent testimonial updated successfully." : "Parent testimonial created successfully.");
      resetForm();
      setShowForm(false);
      await loadParents();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save parent testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (parent) => {
    setShowForm(true);
    setEditingId(parent._id);
    setFormData({
      name: parent.name || "",
      testimonial: parent.testimonial || "",
      photo: parent.photo || "",
    });
  };

  const handleDelete = async (parentId) => {
    if (!window.confirm("Delete this parent testimonial?")) return;
    try {
      const { data } = await axios.delete(`/parents/${parentId}`);
      if (!data.success) {
        throw new Error(data.message || "Failed to delete parent testimonial");
      }
      if (editingId === parentId) {
        resetForm();
        setShowForm(false);
      }
      await loadParents();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete parent testimonial");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Parent Testimonials</h2>
          <p className="text-xs sm:text-sm text-slate-600">Manage parent testimonials displayed on the home page.</p>
        </div>
        <button
          onClick={() => {
            if (showForm && editingId) {
              resetForm();
            }
            setShowForm((value) => !value);
          }}
          className="rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-indigo-700"
        >
          {showForm ? "Close Form" : "Add Parent"}
        </button>
      </header>

      {error && <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}
      {success && <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-600">{success}</div>}

      {showForm && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            {editingId ? "Update Parent Testimonial" : "Create New Parent Testimonial"}
          </h3>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Parent Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Testimonial</label>
              <textarea
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                required
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="Enter the parent's testimonial text..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Parent Photo</label>
              <div className="mt-2 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
                {formData.photo && (
                  <div className="space-y-2">
                    <img
                      src={formData.photo}
                      alt="Parent preview"
                      className="max-h-40 w-40 rounded-full object-cover border-2 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, photo: "" }))}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                    >
                      Remove photo
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2">
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
                {saving ? "Saving..." : editingId ? "Update Testimonial" : "Create Testimonial"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">All Parent Testimonials</h3>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Showing {parents.length} testimonial{parents.length === 1 ? "" : "s"}
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Loading parent testimonials...
          </div>
        ) : parents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No parent testimonials yet. Create one to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {parents.map((parent) => (
              <article
                key={parent._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm hover:border-indigo-200 transition-colors"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0 flex gap-4">
                    {parent.photo && (
                      <img
                        src={parent.photo}
                        alt={parent.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{parent._id}</p>
                      <h4 className="mt-1 text-base sm:text-lg font-semibold text-slate-900">{parent.name}</h4>
                      <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">{parent.testimonial}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full sm:w-40">
                    <button
                      type="button"
                      onClick={() => handleEdit(parent)}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(parent._id)}
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

export default AdminParents;

