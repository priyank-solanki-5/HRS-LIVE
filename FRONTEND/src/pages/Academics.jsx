import React from "react";
import AcademicCard from "../components/AcademicCard";
import HeroWaveSection from "../components/HeroWaveSection";

// Banner image
// import bannerImg from "../assets/images/about-banner.png";

// Academic images
import prePrimaryImg from "../assets/images/pre-primary.png";
import primaryImg from "../assets/images/primary.png";
import middleImg from "../assets/images/middle.png";
import highSchoolImg from "../assets/images/highschool.png";

const academicsData = [
  {
    image: prePrimaryImg,
    title: "Pre - Primary School",
    subtitle: "Nursery / LKG / HKG",
    description:
      "Joyful, play-based learning for little ones. We focus on colors, shapes, sounds, and early social skills.",
  },
  {
    image: primaryImg,
    title: "Primary School",
    subtitle: "Class 1 - 5",
    description:
      "Strong foundation in language and numbers. Encourages curiosity, reading, and basic concepts through fun.",
  },
  {
    image: middleImg,
    title: "Middle School",
    subtitle: "Class 6 - 8",
    description:
      "Skill-building through deeper subject understanding. Projects, teamwork, and logical thinking are encouraged.",
  },
  {
    image: highSchoolImg,
    title: "High School",
    subtitle: "Class 9 - 10",
    description:
      "Focused academics and exam preparation. We support career awareness and goal setting.",
  },
];

const Academics = () => {
  return (
    <>
    <title>Academics | Holy Redeemer School</title>
    <div className="bg-white">
      <HeroWaveSection
        eyebrow="Discover Our Programs"
        title="Academics"
        subtitle="A continuum of learning that nurtures curious minds from early childhood through high school."
      />

      {/* Academic Cards */}
      <section className="container mx-auto px-6 py-16">
  <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 justify-items-center">
    {academicsData.map((item, index) => (
      <AcademicCard key={index} {...item} />
    ))}
  </div>
</section>

    </div>
    </>
  );
};

export default Academics;
