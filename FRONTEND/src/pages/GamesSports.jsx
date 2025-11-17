import React from "react";
import HeroWaveSection from "../components/HeroWaveSection";

// Sports images
import cricketImg from "../assets/images/cricket.png";
import footballImg from "../assets/images/football.png";
import karateImg from "../assets/images/karate.png";
import yogaImg from "../assets/images/yoga.png";
import athleticsImg from "../assets/images/athletics.png";

const sportsData = [
  { image: cricketImg, title: "Cricket", icon: "🏏" },
  { image: footballImg, title: "Football", icon: "⚽" },
  { image: karateImg, title: "Karate", icon: "🥋" },
  { image: yogaImg, title: "Yoga", icon: "🧘" },
  { image: athleticsImg, title: "Athletics", icon: "🏃" },
];

const GamesSports = () => {
  return (
    <>
    <title>Games & Sports | Holy Redeemer School</title>
    <div className="bg-white">
      <HeroWaveSection
        eyebrow="Active Bodies, Sharp Minds"
        title="Games & Sports"
        subtitle="Competitive teams and daily fitness programs build confidence, discipline, and school spirit."
      />

      {/* Intro */}
      <section className="container mx-auto px-6 py-16 text-center">
        <p className="text-xl md:text-2xl font-semibold italic mb-6">
          “We nurture physical fitness and team spirit!”
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mb-10 relative inline-block">
          List of Sports Offered
          <span className="block w-16 h-1 bg-indigo-900 mx-auto mt-2 rounded"></span>
        </h2>

        {/* Sports Grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {sportsData.map((sport, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
            >
              <img
                src={sport.image}
                alt={sport.title}
                className="w-full h-56 object-cover rounded-t-2xl border-2 border-indigo-900"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold">
                  {sport.icon} {sport.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </>
  );
};

export default GamesSports;
