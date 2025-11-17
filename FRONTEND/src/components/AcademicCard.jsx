import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";

const AcademicCard = ({ image, title, subtitle, description }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto">
      <Card
        image={image}
        title={title}
        description={description}
        showGradient={true}
        onClick={() => navigate("/admissions/apply")}
        className="h-full"
      />
      {subtitle && (
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      )}
    </div>
  );
};

export default AcademicCard;
