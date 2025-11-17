import React from "react";
import Waves from "../pages/Waves";

const alignmentMap = {
  center: "items-center text-center",
  left: "items-start text-left",
  right: "items-end text-right",
};

const HeroWaveSection = ({
  eyebrow = "Discover Our Programs",
  eyebrowColor = "text-yellow-200",
  title,
  titleColor = "text-yellow-100",
  subtitle,
  subtitleColor = "text-yellow-100",
  heightClass = "h-[420px]",
  gradientColors = ["#0A1A3F", "#132B63", "#0A1A3F"],
  overlayOpacity = 0.45,
  align = "center",
  wavesClassName = "opacity-70 pointer-events-none",
  wavesProps = {},
  children,
}) => {
  const alignmentClass = alignmentMap[align] || alignmentMap.center;

  const defaultWavesProps = {
    lineColor: "rgba(255,255,255,0.4)",
    backgroundColor: "transparent",
    waveSpeedX: 0.02,
    waveSpeedY: 0.01,
    waveAmpX: 40,
    waveAmpY: 20,
    friction: 0.9,
    tension: 0.01,
    maxCursorMove: 120,
    xGap: 12,
    yGap: 36,
  };

  const mergedWavesProps = { ...defaultWavesProps, ...wavesProps };

  const [from, via, to] = gradientColors;

  return (
    <section
      className={`relative overflow-hidden text-white flex ${heightClass} items-center justify-center px-4`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(5, 10, 20, ${overlayOpacity})`,
        }}
      />
      <div className={`relative z-10 space-y-4 max-w-3xl ${alignmentClass}`}>
        {eyebrow && (
          <p
            className={`uppercase tracking-[0.3em] text-xs md:text-sm ${eyebrowColor}`}
          >
            {eyebrow}
          </p>
        )}
        {title && (
          <h1 className={`text-3xl md:text-5xl font-bold ${titleColor}`}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p className={`text-base md:text-lg ${subtitleColor}`}>{subtitle}</p>
        )}
        {children}
      </div>
      <Waves className={wavesClassName} {...mergedWavesProps} />
    </section>
  );
};

export default HeroWaveSection;

