"use client";

const QuoteDecor = ({ className = "" }) => {
  return (
    <svg
      className={`text-[var(--color-surface-inverse-brand-primary)] opacity-100 ${className}`}
      viewBox="0 0 1242 163"
      aria-hidden="true"
      overflow="visible"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="currentColor">
        {/* First ellipse - top left */}
        <ellipse
          cx="590"
          cy="40"
          rx="90"
          ry="40"
          transform="rotate(-35 600 80)"
        />
        {/* Second ellipse - middle */}
        <ellipse
          cx="608"
          cy="100"
          rx="90"
          ry="40"
          transform="rotate(-35 600 80)"
        />
        {/* Third ellipse - bottom right */}
        <ellipse
          cx="610"
          cy="155"
          rx="90"
          ry="40"
          transform="rotate(-35 600 80)"
        />
      </g>
    </svg>
  );
};

export default QuoteDecor;
