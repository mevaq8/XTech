export default function CubePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>
          <linearGradient id="cubeLeft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="cubeRight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <filter id="cubeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.08" />
          </filter>
        </defs>
        <g filter="url(#cubeShadow)">
          <path d="M60 10L100 30L60 50L20 30Z" fill="url(#cubeTop)" />
          <path d="M20 30L60 50V100L20 80Z" fill="url(#cubeLeft)" />
          <path d="M60 50L100 30V80L60 100Z" fill="url(#cubeRight)" />
          <path d="M60 50V100" stroke="#94A3B8" strokeWidth="0.5" opacity="0.3" />
          <path d="M20 30L60 50L100 30" stroke="#94A3B8" strokeWidth="0.5" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
}
