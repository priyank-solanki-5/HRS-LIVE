import React, { useCallback, useEffect, useState } from "react";
import axios from "../../utils/axios";

const emptyForm = {
  title: "",
  date: "",
  description: "",
  image: "",
  isHighlighted: false,
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "upcoming", "highlighted"


  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/events");
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch events");
      }
      setEvents(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

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
        image: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (!formData.title || !formData.date || !formData.description) {
      setError("Please fill in all required fields.");
      setSaving(false);
      return;
    }

    try {
      const { data } = await axios[editingId ? 'put' : 'post'](
        editingId ? `/events/${editingId}` : "/events",
        formData
      );
      if (!data.success) {
        throw new Error(data.message || "Failed to save event");
      }
      setSuccess(editingId ? "Event updated successfully." : "Event created successfully.");
      resetForm();
      setShowForm(false);
      await loadEvents();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (event) => {
    setShowForm(true);
    setEditingId(event._id);
    setFormData({
      title: event.title || "",
      date: event.date || "",
      description: event.description || "",
      image: event.image || "",
      isHighlighted: event.isHighlighted || false,
    });
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      const { data } = await axios.delete(`/events/${eventId}`);
      if (!data.success) {
        throw new Error(data.message || "Failed to delete event");
      }
      if (editingId === eventId) {
        resetForm();
        setShowForm(false);
      }
      await loadEvents();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete event");
    }
  };

  const handleToggleHighlight = async (eventId, currentStatus) => {
    try {
      const { data } = await axios.patch(`/events/${eventId}/highlight`);
      if (!data.success) {
        throw new Error(data.message || "Failed to toggle highlight");
      }
      setSuccess(data.message || `Event ${data.data.isHighlighted ? 'highlighted' : 'unhighlighted'} successfully.`);
      await loadEvents();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to toggle highlight");
    }
  };

  // Helper function to check if event date is in the future
  const isUpcomingEvent = (eventDate) => {
    if (!eventDate) return false;
    try {
      const eventDateObj = new Date(eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDateObj >= today;
    } catch {
      return false;
    }
  };

  // Filter events based on selected filter
  const getFilteredEvents = () => {
    switch (filter) {
      case "upcoming":
        return events.filter(event => isUpcomingEvent(event.date));
      case "highlighted":
        return events.filter(event => event.isHighlighted);
      default:
        return events;
    }
  };

  const filteredEvents = getFilteredEvents();

  const formatDate = (value) => {
    if (!value) return "—";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return value;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Events</h2>
          <p className="text-xs sm:text-sm text-slate-600">Create, edit, and manage school events.</p>
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
          {showForm ? "Close Form" : "Add Event"}
        </button>
      </header>

      {error && <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}
      {success && <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-600">{success}</div>}

      {showForm && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            {editingId ? "Update Event" : "Create New Event"}
          </h3>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Event Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="e.g. Annual Sports Day"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Event Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Event Image</label>
              <div className="mt-2 space-y-2">
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
                      alt="Event preview"
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
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="Share what makes this event special."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isHighlighted"
                  checked={formData.isHighlighted}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isHighlighted: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Highlight this event (show in event highlights section)
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
                {saving ? "Saving..." : editingId ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="space-y-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
              filter === "upcoming"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setFilter("highlighted")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
              filter === "highlighted"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Highlighted Events
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            {filter === "all" ? "All Events" : filter === "upcoming" ? "Upcoming Events" : "Highlighted Events"}
          </h3>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Showing {filteredEvents.length} of {events.length} event{events.length === 1 ? "" : "s"}
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            {filter === "all" 
              ? "No events yet. Create one to get started."
              : filter === "upcoming"
              ? "No upcoming events found."
              : "No highlighted events found."}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <article
                key={event._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm hover:border-indigo-200 transition-colors"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{event._id}</p>
                      {event.isHighlighted && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                          ★ Highlighted
                        </span>
                      )}
                    </div>
                    <h4 className="mt-1 text-base sm:text-lg font-semibold text-slate-900">{event.title}</h4>
                    <p className="mt-1 text-xs font-medium text-indigo-600">Scheduled for {formatDate(event.date)}</p>
                    <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">{event.description}</p>
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="mt-3 max-h-48 w-full rounded-lg object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 w-full sm:w-40">
                    <button
                      type="button"
                      onClick={() => handleEdit(event)}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleHighlight(event._id, event.isHighlighted)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        event.isHighlighted
                          ? "border-yellow-300 bg-yellow-50 text-yellow-700 hover:border-yellow-400"
                          : "border-slate-200 text-slate-600 hover:border-yellow-200 hover:text-yellow-600"
                      }`}
                    >
                      {event.isHighlighted ? "★ Highlighted" : "☆ Highlight"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(event._id)}
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

export default AdminEvents;
