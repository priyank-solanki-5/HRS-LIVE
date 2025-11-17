import React from 'react';

const Card = ({ 
  image, 
  title, 
  description, 
  date, 
  onClick,
  className = "",
  imageClassName = "",
  showGradient = true
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl bg-white shadow-md
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
        cursor-pointer ${onClick ? '' : 'cursor-default'}
        ${className}
      `}
    >
      {/* Image Container */}
      <div className="relative w-full h-56 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className={`
              w-full h-full object-cover transition-transform duration-700 ease-out
              group-hover:scale-110
              ${imageClassName}
            `}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300?text=Image";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Date Badge */}
        {date && (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-900 text-sm font-semibold px-3 py-1.5 rounded-full shadow-md">
            {date}
          </span>
        )}
      </div>

      {/* Content Container */}
      <div className="p-6">
        {showGradient ? (
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-indigo-700 group-hover:to-purple-700 transition-all duration-300">
            {title}
          </h3>
        ) : (
          <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
            {description}
          </p>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-500 pointer-events-none" />
    </div>
  );
};

export default Card;

