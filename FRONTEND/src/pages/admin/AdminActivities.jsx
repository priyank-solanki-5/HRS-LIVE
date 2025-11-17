import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "../../utils/axios";

const categoryOptions = [
  { label: "Curricular", value: "curricular" },
  { label: "Co-Curricular", value: "co-curricular" },
  { label: "Extra-Curricular", value: "extra-curricular" },
];

const emptyForm = {
  title: "",
  description: "",
  category: "curricular",
  image: "",
  order: 0,
  isVisible: true,
};

const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const groupedActivities = useMemo(() => {
    return categoryOptions.reduce((acc, option) => {
      const items = activities
        .filter((activity) => activity.category === option.value)
        .sort((a, b) => {
          if (a.order !== b.order) return a.order - b.order;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
      acc[option.value] = items;
      return acc;
    }, {});
  }, [activities]);

  const getNextOrder = useCallback(
    (category) => {
      const items = groupedActivities[category] || [];
      if (items.length === 0) return 0;
      const highest = Math.max(...items.map((item) => item.order ?? 0));
      return Number.isFinite(highest) ? highest + 1 : items.length;
    },
    [groupedActivities]
  );

  const resetForm = useCallback(
    (category = "curricular") => {
      setFormData({
        ...emptyForm,
        category,
        order: getNextOrder(category),
      });
      setEditingId(null);
    },
    [getNextOrder]
  );

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/activities");
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch activities");
      }
      setActivities(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  useEffect(() => {
    if (!showForm || editingId) return;
    setFormData((prev) => ({
      ...prev,
      order: getNextOrder(prev.category),
    }));
  }, [showForm, editingId, getNextOrder]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      setError("Please fill in the required fields.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image: formData.image,
        order: Number.isFinite(formData.order) ? formData.order : 0,
        isVisible: formData.isVisible,
      };

      const { data } = await axios[editingId ? "put" : "post"](
        editingId ? `/activities/${editingId}` : "/activities",
        payload
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to save activity");
      }

      setSuccess(editingId ? "Activity updated successfully." : "Activity created successfully.");
      await loadActivities();
      setShowForm(false);
      resetForm(formData.category);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save activity");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (activity) => {
    setShowForm(true);
    setEditingId(activity._id);
    setFormData({
      title: activity.title || "",
      description: activity.description || "",
      category: activity.category || "curricular",
      image: activity.image || "",
      order: Number.isFinite(activity.order) ? activity.order : 0,
      isVisible: activity.isVisible ?? true,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      const { data } = await axios.delete(`/activities/${id}`);
      if (!data.success) {
        throw new Error(data.message || "Failed to delete activity");
      }
      if (editingId === id) {
        const deleted = activities.find((item) => item._id === id);
        resetForm(deleted?.category);
        setShowForm(false);
      }
      setSuccess("Activity deleted successfully.");
      await loadActivities();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete activity");
    }
  };

  const handleToggleVisibility = async (activity) => {
    try {
      const { data } = await axios.put(`/activities/${activity._id}`, {
        isVisible: !activity.isVisible,
      });
      if (!data.success) {
        throw new Error(data.message || "Failed to update visibility");
      }
      setSuccess(`Activity ${activity.isVisible ? "hidden" : "made visible"} successfully.`);
      await loadActivities();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update visibility");
    }
  };

  const handleReorder = async (category, activityId, direction) => {
    const items = [...(groupedActivities[category] || [])];
    const currentIndex = items.findIndex((item) => item._id === activityId);
    if (currentIndex === -1) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    const [movedItem] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    const updates = reordered.map((item, index) => ({
      id: item._id,
      order: index,
    }));

    try {
      const { data } = await axios.post("/activities/reorder", { updates });
      if (!data.success) {
        throw new Error(data.message || "Failed to reorder activities");
      }
      await loadActivities();
      setSuccess("Activities reordered successfully.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to reorder activities");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Activities</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Create and arrange activities to showcase in the public site.
          </p>
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
          {showForm ? "Close Form" : "Add Activity"}
        </button>
      </header>

      {error && <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}
      {success && <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-600">{success}</div>}

      {showForm && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            {editingId ? "Update Activity" : "Create New Activity"}
          </h3>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="e.g. Mathematics Lab Sessions"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    category: value,
                    order: editingId ? prev.order : getNextOrder(value),
                  }));
                }}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Display Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                min={0}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="Describe the activity in a few short sentences."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Activity Image
              </label>
              <div className="mt-2 space-y-2">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/activity-image.jpg"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500">
                  Paste an image link or upload a file below.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
                {formData.image && (
                  <div className="space-y-2">
                    <img
                      src={formData.image}
                      alt="Activity preview"
                      className="max-h-40 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isVisible"
                  checked={formData.isVisible}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Show this activity on the website
                </span>
              </label>
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
                {saving ? "Saving..." : editingId ? "Update Activity" : "Create Activity"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="space-y-8">
        {categoryOptions.map((option) => {
          const items = groupedActivities[option.value] || [];

          return (
            <article
              key={option.value}
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
            >
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{option.label} Activities</h3>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {items.length} activit{items.length === 1 ? "y" : "ies"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(true);
                    resetForm(option.value);
                  }}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                >
                  Add {option.label}
                </button>
              </header>

              {loading ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  Loading activities...
                </div>
              ) : items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No activities yet. Create one to get started.
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((activity, index) => (
                    <div
                      key={activity._id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                            #{index + 1}
                          </span>
                          {!activity.isVisible && (
                            <span className="inline-flex items-center justify-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                              Hidden
                            </span>
                          )}
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-slate-900 break-words">
                          {activity.title}
                        </h4>
                        <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">
                          {activity.description}
                        </p>
                        {activity.image && (
                          <img
                            src={activity.image}
                            alt={activity.title}
                            className="mt-3 max-h-48 w-full rounded-lg object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-2 w-full sm:w-44">
                        <button
                          type="button"
                          onClick={() => handleEdit(activity)}
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(activity)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            activity.isVisible
                              ? "border-slate-200 text-slate-600 hover:border-amber-200 hover:text-amber-600"
                              : "border-amber-300 bg-amber-50 text-amber-700 hover:border-amber-400"
                          }`}
                        >
                          {activity.isVisible ? "Hide" : "Show"}
                        </button>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleReorder(option.value, activity._id, -1)}
                            disabled={index === 0}
                            className="flex-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-50 hover:border-indigo-200 hover:text-indigo-600"
                          >
                            Move Up
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(option.value, activity._id, 1)}
                            disabled={index === items.length - 1}
                            className="flex-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-50 hover:border-indigo-200 hover:text-indigo-600"
                          >
                            Move Down
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(activity._id)}
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:border-rose-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default AdminActivities;

