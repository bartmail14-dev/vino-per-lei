// Premium wine category icons — illustrative, luxury style
// viewBox 64x64 for detail, strokeWidth 1.5, currentColor strokes

export function RedWineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Stem */}
      <path d="M32 44V52" stroke="currentColor" strokeWidth="1.5" />
      {/* Base — elegant elliptical */}
      <ellipse cx="32" cy="54" rx="10" ry="2.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Bowl — generous Bordeaux shape */}
      <path
        d="M18 12H46L44 28C43 34 38.5 42 32 44C25.5 42 21 34 20 28L18 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Wine fill at ~60% — rich burgundy */}
      <path
        d="M20.8 22C21.6 28 25.5 35 32 37.5C38.5 35 42.4 28 43.2 22L44.2 16H19.8L20.8 22Z"
        fill="#722F37"
        opacity="0.7"
      />
      {/* Wine surface — darker meniscus line */}
      <path
        d="M19.8 16C20.4 16 25 17.5 32 17.5C39 17.5 43.6 16 44.2 16"
        stroke="#722F37"
        strokeWidth="0.75"
        opacity="0.5"
      />
      {/* Reflection highlight — left side of bowl */}
      <path
        d="M22 14C22 14 22.5 24 24 30"
        stroke="white"
        strokeWidth="1"
        opacity="0.25"
      />
      {/* Rim highlight */}
      <path
        d="M20 12.5C24 13.5 28 14 32 14C36 14 40 13.5 44 12.5"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
    </svg>
  );
}

export function WhiteWineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Stem */}
      <path d="M32 44V52" stroke="currentColor" strokeWidth="1.5" />
      {/* Base */}
      <ellipse cx="32" cy="54" rx="9" ry="2.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Bowl — narrower, taller white wine glass */}
      <path
        d="M20 10H44L42.5 26C41.8 32 37.5 42 32 44C26.5 42 22.2 32 21.5 26L20 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Wine fill at ~40% — light golden */}
      <path
        d="M22.2 22C22.8 26.5 26.5 33 32 35C37.5 33 41.2 26.5 41.8 22L42.6 18H21.4L22.2 22Z"
        fill="#c9a227"
        opacity="0.25"
      />
      {/* Wine surface line */}
      <path
        d="M21.4 18C22 18.8 26 19.8 32 19.8C38 19.8 42 18.8 42.6 18"
        stroke="#c9a227"
        strokeWidth="0.75"
        opacity="0.4"
      />
      {/* Refraction lines inside wine */}
      <path d="M28 22L29 28" stroke="#c9a227" strokeWidth="0.5" opacity="0.3" />
      <path d="M34 21L35 26" stroke="#c9a227" strokeWidth="0.5" opacity="0.25" />
      <path d="M31 23L31.5 30" stroke="#c9a227" strokeWidth="0.5" opacity="0.2" />
      {/* Reflection highlight */}
      <path
        d="M24 12C24 12 24.5 20 25.5 26"
        stroke="white"
        strokeWidth="1"
        opacity="0.2"
      />
    </svg>
  );
}

export function RoseWineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Stem */}
      <path d="M32 44V52" stroke="currentColor" strokeWidth="1.5" />
      {/* Base */}
      <ellipse cx="32" cy="54" rx="9.5" ry="2.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Bowl — tulip shape, wider at top then curves in */}
      <path
        d="M19 10H45L43.5 22C42.8 28 39 36 35 40C33.5 41.5 32 43 32 44C32 43 30.5 41.5 29 40C25 36 21.2 28 20.5 22L19 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Wine fill at ~50% — delicate salmon/pink */}
      <path
        d="M21.2 20C21.8 25 25 32 29 36C30.5 37.5 31.5 39 32 40C32.5 39 33.5 37.5 35 36C39 32 42.2 25 42.8 20L43.6 16H20.4L21.2 20Z"
        fill="#ffa38b"
        opacity="0.35"
      />
      {/* Wine surface */}
      <path
        d="M20.4 16C21 17 25.5 18 32 18C38.5 18 43 17 43.6 16"
        stroke="#ffa38b"
        strokeWidth="0.75"
        opacity="0.45"
      />
      {/* Soft reflection */}
      <path
        d="M23 12C23 12 23.5 20 24.5 26"
        stroke="white"
        strokeWidth="1"
        opacity="0.2"
      />
      {/* Delicate petal accent near rim */}
      <circle cx="32" cy="13" r="1.5" fill="#ffa38b" opacity="0.15" />
    </svg>
  );
}

export function BubblesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Stem */}
      <path d="M32 48V54" stroke="currentColor" strokeWidth="1.5" />
      {/* Base */}
      <ellipse cx="32" cy="56" rx="7" ry="2" stroke="currentColor" strokeWidth="1.5" />
      {/* Flute — tall narrow champagne shape */}
      <path
        d="M25 8H39L38 32C37.6 38 35.5 46 32 48C28.5 46 26.4 38 26 32L25 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Gold-tinted liquid at ~30% */}
      <path
        d="M26.6 28C26.9 32 28.5 38 32 40C35.5 38 37.1 32 37.4 28L37.8 24H26.2L26.6 28Z"
        fill="#c9a227"
        opacity="0.25"
      />
      {/* Liquid surface */}
      <path
        d="M26.2 24C26.6 25 29 25.5 32 25.5C35 25.5 37.4 25 37.8 24"
        stroke="#c9a227"
        strokeWidth="0.75"
        opacity="0.4"
      />
      {/* Ascending bubbles — varying sizes, staggered */}
      <circle cx="31" cy="36" r="1.2" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
      <circle cx="33.5" cy="32" r="1" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      <circle cx="30.5" cy="28" r="0.8" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
      <circle cx="33" cy="26" r="0.6" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
      {/* Upper bubbles — smaller, fading */}
      <circle cx="31.5" cy="22" r="0.5" fill="currentColor" opacity="0.2" />
      <circle cx="33" cy="19" r="0.4" fill="currentColor" opacity="0.15" />
      <circle cx="30" cy="17" r="0.35" fill="currentColor" opacity="0.12" />
      <circle cx="32" cy="14" r="0.3" fill="currentColor" opacity="0.1" />
      {/* Reflection highlight on flute */}
      <path
        d="M27.5 10C27.5 10 27.5 20 27.8 28"
        stroke="white"
        strokeWidth="0.75"
        opacity="0.2"
      />
    </svg>
  );
}

export function GiftBoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Box body */}
      <rect x="12" y="26" width="40" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
      {/* Lid */}
      <rect x="10" y="20" width="44" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      {/* Vertical ribbon */}
      <path d="M32 20V54" stroke="#722F37" strokeWidth="2.5" opacity="0.6" />
      {/* Horizontal ribbon on lid */}
      <path d="M10 24H54" stroke="#722F37" strokeWidth="2.5" opacity="0.6" />
      {/* Bow — left loop */}
      <path
        d="M32 20C32 20 26 16 24 14C22 12 22 10 24 9C26 8 28 9 30 12C31 14 32 17 32 20Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="#722F37"
        opacity="0.2"
      />
      {/* Bow — right loop */}
      <path
        d="M32 20C32 20 38 16 40 14C42 12 42 10 40 9C38 8 36 9 34 12C33 14 32 17 32 20Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="#722F37"
        opacity="0.2"
      />
      {/* Bow center knot */}
      <circle cx="32" cy="20" r="2" fill="#722F37" opacity="0.5" stroke="currentColor" strokeWidth="1" />
      {/* Diagonal texture lines on box — left half */}
      <line x1="14" y1="30" x2="18" y2="34" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      <line x1="14" y1="36" x2="22" y2="44" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      <line x1="14" y1="42" x2="22" y2="50" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      <line x1="18" y1="48" x2="22" y2="52" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      {/* Diagonal texture lines on box — right half */}
      <line x1="42" y1="30" x2="46" y2="34" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      <line x1="42" y1="36" x2="50" y2="44" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      <line x1="42" y1="42" x2="50" y2="50" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      <line x1="46" y1="48" x2="50" y2="52" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
    </svg>
  );
}

export function TuscanyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Trunk */}
      <path d="M32 56V24" stroke="currentColor" strokeWidth="1.5" />
      {/* Cypress tree — layered pointed foliage */}
      <path
        d="M32 6C32 6 24 14 24 22C24 28 27 32 32 36C37 32 40 28 40 22C40 14 32 6 32 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        opacity="0.15"
      />
      {/* Inner foliage detail — lighter layer */}
      <path
        d="M32 10C32 10 27 16 27 22C27 26 29 29 32 32C35 29 37 26 37 22C37 16 32 10 32 10Z"
        fill="currentColor"
        opacity="0.1"
      />
      {/* Subtle center vein */}
      <path d="M32 10V32" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      {/* Small ground line */}
      <path d="M26 56H38" stroke="currentColor" strokeWidth="1.5" />
      {/* Tiny roots */}
      <path d="M30 56L28 58" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
      <path d="M34 56L36 58" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
    </svg>
  );
}
