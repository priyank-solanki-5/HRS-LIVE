import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import Card from "../components/Card";
import HeroWaveSection from "../components/HeroWaveSection";

const Events = () => {
  const [highlights, setHighlights] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightLoading, setHighlightLoading] = useState(true);
  const [allEventsLoading, setAllEventsLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    let cancelled = false;
    
    const loadEvents = async () => {
      try {
        // Load all events and highlighted events
        const [allEventsResponse, highlightedResponse] = await Promise.all([
          axios.get("/events"),
          axios.get("/events/highlighted")
        ]);

        if (!cancelled) {
          if (allEventsResponse.data.success && highlightedResponse.data.success) {
            const allEventsData = Array.isArray(allEventsResponse.data.data) ? allEventsResponse.data.data : [];
            const highlightedEvents = Array.isArray(highlightedResponse.data.data) ? highlightedResponse.data.data : [];
            
            // Set highlighted events
            setHighlights(highlightedEvents);
            setHighlightLoading(false);
            
            // Set all events
            setAllEvents(allEventsData);
            setAllEventsLoading(false);
            
            // Filter upcoming events (events with future dates, excluding highlighted)
            const highlightedIds = new Set(highlightedEvents.map(h => h._id));
            const upcomingEvents = allEventsData.filter(e => 
              !highlightedIds.has(e._id) && isUpcomingEvent(e.date)
            );
            setUpcoming(upcomingEvents);
            setLoading(false);
          } else {
            throw new Error("Failed to load events");
          }
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Failed to load events:", e);
          setError(e.response?.data?.message || e.message || "Failed to load events");
          setHighlights([]);
          setAllEvents([]);
          setUpcoming([]);
          setHighlightLoading(false);
          setAllEventsLoading(false);
          setLoading(false);
        }
      }
    };

    loadEvents();
    
    return () => {
      cancelled = true;
    };
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      return `${day} ${month}`;
    } catch {
      return dateString;
    }
  };

  // 🔁 Reusable card component for both sections
  const EventCard = ({ event }) => (
    <Card
      image={event.image}
      title={event.title}
      description={event.description}
      date={event.date ? formatDate(event.date) : null}
      showGradient={true}
    />
  );

  return (
    <>
      <title>Events | Holy Redeemer School</title>
      <div className="bg-white">
        <HeroWaveSection
          eyebrow="Celebrate Every Moment"
          title="Events"
          subtitle="From academic fairs to cultural fests, here’s what’s happening on campus."
        />

        {/* Event Highlights - First Section */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Events Highlights
          </h2>
          {highlightLoading && (
            <div className="text-center text-gray-600">Loading highlighted events...</div>
          )}
          {!highlightLoading && highlights.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No highlighted events at the moment.
            </div>
          )}
          {!highlightLoading && highlights.length > 0 && (
            <div className="grid gap-8 md:grid-cols-3">
              {highlights.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* All Events - Second Section */}
        <section className="container mx-auto px-6 py-16 bg-gray-50">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            All Events
          </h2>
          {allEventsLoading && (
            <div className="text-center text-gray-600">Loading all events...</div>
          )}
          {error && (
            <div className="text-center text-red-600">{error}</div>
          )}
          {!allEventsLoading && !error && (
            <div className="grid gap-8 md:grid-cols-3">
              {allEvents.length > 0 ? (
                allEvents.map((event) => <EventCard key={event._id} event={event} />)
              ) : (
                <div className="text-center col-span-3 text-gray-500">
                  No events found.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Upcoming Events - Third Section */}
        <section className="container mx-auto px-6 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Upcoming Events
          </h2>
          {loading && (
            <div className="text-center text-gray-600">Loading upcoming events...</div>
          )}
          {!loading && !error && (
            <div className="grid gap-8 md:grid-cols-3">
              {upcoming.length > 0 ? (
                upcoming.map((event) => <EventCard key={event._id} event={event} />)
              ) : (
                <div className="text-center col-span-3 text-gray-500">
                  No upcoming events found.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Events;
