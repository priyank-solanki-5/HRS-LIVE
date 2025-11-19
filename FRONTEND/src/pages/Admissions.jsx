import React from "react";
import { Link } from "react-router-dom";
import HeroWaveSection from "../components/HeroWaveSection";

const Admissions = () => {
  return (
    <>
    <title>Admissions | Holy Redeemer School</title>
    <div className="bg-white">
      <HeroWaveSection
        eyebrow="Join Our Community"
        title="Admissions"
        subtitle="Open seats for the 2025–26 session in English and Gujarati medium. Start your journey with us."
      >
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <Link
            to="/admissions/apply"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-yellow-300/90 text-blue-950 font-semibold shadow-lg hover:bg-yellow-200 transition"
          >
            Apply Online
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/60 text-white font-semibold hover:bg-white/10 transition"
          >
            Talk To Us
          </Link>
        </div>
      </HeroWaveSection>

      {/* Welcome Text */}
      <section className="container mx-auto px-6 py-12 text-center">
        <p className="text-lg md:text-2xl font-semibold text-gray-800 leading-relaxed max-w-4xl mx-auto mb-6">
          "We welcome students to join our nurturing and academically strong
          environment. Admissions are open for the academic year{" "}
          <span className="font-bold">2025–26</span> for both{" "}
          <span className="text-blue-900 font-bold">English and Gujarati medium.</span>"
        </p>
        <Link
          to="/admissions/apply"
          className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition text-lg"
        >
          Enroll Now
        </Link>
      </section>

      {/* English Medium */}
      <section className="container mx-auto px-6 py-8 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Admissions Form – English Medium
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full shadow-md hover:bg-blue-800 transition">
            Nursery / L.K.G / H.K.G
          </button>
          <button className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full shadow-md hover:bg-blue-800 transition">
            STD. 1 to 8
          </button>
          <button className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full shadow-md hover:bg-blue-800 transition">
            STD. 9th and 10th
          </button>
        </div>
      </section>

      {/* Gujarati Medium */}
      <section className="container mx-auto px-6 py-8 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Admissions Form – Gujarati Medium
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full shadow-md hover:bg-blue-800 transition">
            Nursery / L.K.G / H.K.G
          </button>
          <button className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full shadow-md hover:bg-blue-800 transition">
            STD. 1 to 8
          </button>
          <button className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full shadow-md hover:bg-blue-800 transition">
            STD. 9th and 10th
          </button>
        </div>
      </section>
    </div>
    </>
  );
};

export default Admissions;
