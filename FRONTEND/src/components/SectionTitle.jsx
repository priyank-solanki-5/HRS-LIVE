import React from "react";

const SectionTitle = ({ icon, title }) => {
  return (
    <div className="text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      <div className="w-20 h-1 bg-blue-900 mx-auto mt-2 rounded"></div>
    </div>
  );
};

export default SectionTitle;
