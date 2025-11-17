import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import SectionTitle from "../../components/SectionTitle.jsx";
import { motion } from "framer-motion";
import Card from "../../components/Card";
import HeroWaveSection from "../../components/HeroWaveSection";

const categoryCopy = {
  "curricular": {
    heading: "Curricular Activities",
    description:
      "Explore core classroom programs designed to strengthen academic excellence and foundational skills."
  },
  "co-curricular": {
    heading: "Co-Curricular Activities",
    description:
      "Discover integrated learning experiences that extend classroom concepts into practical, collaborative projects."
  },
  "extra-curricular": {
    heading: "Extra-Curricular Activities",
    description:
      "Celebrate diverse interests with clubs and pursuits that encourage creativity, leadership, and teamwork."
  }
};

const ActivityCard = ({ title, description, image, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <Card
        image={image}
        title={title}
        description={description}
        showGradient={true}
        className="h-full"
      />
    </motion.div>
  );
};

const ActivityCategoryPage = ({ categoryKey }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchActivities = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`/activities?category=${categoryKey}`);
        if (isMounted) {
          const { data = [] } = response.data || {};
          setActivities(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              "We couldn't load the activities right now. Please try again later."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, [categoryKey]);

  const copy = categoryCopy[categoryKey] || {
    heading: "Activities",
    description: "Stay tuned for exciting programmes and student highlights."
  };

  return (
    <>
      <HeroWaveSection
        eyebrow="Student Life"
        title={copy.heading}
        subtitle={copy.description}
      />
    <section className="relative overflow-hidden bg-slate-950/5 py-24">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <motion.div
          className="absolute -left-32 -top-56 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl"
          animate={{ y: [0, 24, -12, 0], x: [0, 12, -18, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{ y: [0, -18, 14, 0], x: [0, -12, 12, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.35, 0.5, 0.4, 0.55, 0.35] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="inline-flex items-center rounded-full border border-slate-200/60 bg-white/60 px-4 py-2 text-sm font-medium uppercase tracking-[0.32em] text-slate-500 shadow-sm shadow-slate-900/5 backdrop-blur">
            Activities
          </div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-6"
          >
            <SectionTitle icon="✨" title={`${copy.heading} Highlights`} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl"
          >
            {copy.description}
          </motion.p>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-16 flex flex-col items-center gap-4 text-slate-500"
          >
            <motion.span
              className="h-14 w-14 rounded-full border-2 border-sky-200 border-t-sky-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-base font-medium">Loading activities...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center text-red-500"
          >
            {error}
          </motion.div>
        ) : activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center text-slate-500"
          >
            Activities will be updated soon. Please check back later.
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {activities.map((activity, index) => (
              <ActivityCard
                key={activity._id}
                title={activity.title}
                description={activity.description}
                image={activity.image}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
    </>
  );
};

export default ActivityCategoryPage;

