import React from "react";
import SectionTitle from "../components/SectionTitle";
import HeroWaveSection from "../components/HeroWaveSection";
import schoolImg from "../assets/images/school.png";
import visionImg from "../assets/images/vision.png";
import missionImg from "../assets/images/mission.png";
import principalImg from "../assets/images/principal.png";

const AboutUs = () => {
  return (
    <>
    <title>About Us | Holy Redeemer School</title>
    <div className="bg-white">
      <HeroWaveSection
        eyebrow="Who We Are"
        title="About Us"
        subtitle="Rooted in values and driven by innovation, Holy Redeemer School empowers every learner to thrive."
      />

      <div className="container mx-auto px-6 py-16 space-y-20">
        {/* School Overview */}
        <section>
          <SectionTitle icon="📘" title="School Overview" />
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={schoolImg}
              alt="School"
              className="w-full md:w-1/2 rounded-lg shadow"
            />
            <div className="flex flex-col space-y-4 font-semibold">
              <p className="text-gray-700 leading-relaxed text-lg">
                Holy Redeemer School offers classes from Nursery to Grade 10,
                focusing on academic excellence and overall development. We
                provide a nurturing environment that encourages learning,
                creativity, and strong values, guided by experienced educators
                and modern teaching methods.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Our campus is designed to support curiosity, confidence, and
                active participation. With a balance of academics and
                co-curricular activities, we shape students into responsible,
                future-ready individuals.
              </p>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section>
          <SectionTitle icon="🌟" title="Our Vision" />
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <img
              src={visionImg}
              alt="Vision"
              className="w-full md:w-1/2 rounded-lg shadow"
            />
            <div className="flex flex-col space-y-4 font-semibold">
              <li className="text-gray-700 leading-relaxed text-lg">
                To be a center of excellence that nurtures responsible,
                confident, and compassionate individuals through quality
                education and holistic development.
              </li>
              <li className="text-gray-700 leading-relaxed text-lg">
                We envision a learning space where students grow intellectually,
                emotionally, and socially.Our goal is to empower every child to
                become a lifelong learner and a positive contributor to society.
              </li>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section>
          <SectionTitle icon="🎯" title="Our Mission" />
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={missionImg}
              alt="Mission"
              className="w-full md:w-1/2 rounded-lg shadow"
            />
            <div className="flex flex-col space-y-4 font-semibold">
              <p className="text-gray-700 leading-relaxed text-lg">
                Our mission is to provide a safe, supportive, and inspiring
                environment where students can achieve academic success, develop
                strong moral values, and discover their unique potential. We are
                committed to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed text-lg space-y-2">
                <li>
                  Fostering a love for learning through innovative teaching.
                </li>
                <li>Encouraging critical thinking and creativity.</li>
                <li>
                  Promoting respect, integrity, and social responsibility.
                </li>
                <li>
                  Building strong partnerships with families and the community.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Principal’s Message */}
        <section>
          <SectionTitle icon="👩‍🏫" title="Principal’s Message" />
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-gray-700 leading-relaxed text-lg font-semibold">
              <p>
                Welcome to Holy Redeemer School, where every child is valued,
                guided, and inspired. We believe that education is not just
                about academic achievement, but about building character,
                confidence, and compassion.
              </p>
              <p className="mt-4">
                Our dedicated team of educators strives to create a joyful and
                engaging learning environment. We encourage students to think
                critically, act responsibly, and dream big.
              </p>
              <p className="mt-4">
                At Holy Redeemer, we don’t just prepare students for exams — we
                prepare them for life.
              </p>
              <p className="mt-6 font-semibold">
                Warm regards, <br />
                [Principal’s Name] <br />
                Principal, Holy Redeemer School
              </p>
            </div>
            <img
              src={principalImg}
              alt="Principal"
              className="w-full md:w-1/3 rounded-lg shadow"
            />
          </div>
        </section>
      </div>
    </div>
    </>
  );
};

export default AboutUs;
