// Clean wine category icons — minimal, consistent stroke style
// viewBox 0 0 48 48, strokeWidth 1.5, currentColor

export function RedWineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 8h20l-1.5 14c-.8 5-4 11-8.5 13-4.5-2-7.7-8-8.5-13L14 8z" />
      <path d="M16.2 16c.5 4 3 9 7.8 11 4.8-2 7.3-7 7.8-11z" fill="currentColor" opacity="0.12" />
      <line x1="24" y1="35" x2="24" y2="40" />
      <ellipse cx="24" cy="41" rx="7" ry="2" />
    </svg>
  );
}

export function WhiteWineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 6h16l-1.2 16c-.6 5-3.5 11-6.8 13-3.3-2-6.2-8-6.8-13L16 6z" />
      <path d="M18 18c.4 3.5 2.8 8 6 10 3.2-2 5.6-6.5 6-10z" fill="currentColor" opacity="0.1" />
      <line x1="24" y1="35" x2="24" y2="40" />
      <ellipse cx="24" cy="41" rx="6.5" ry="2" />
    </svg>
  );
}

export function RoseWineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6h18l-1.5 14c-.7 5-3.5 10-7.5 13-4-3-6.8-8-7.5-13L15 6z" />
      <path d="M17 16c.5 4 3 8.5 7 11 4-2.5 6.5-7 7-11z" fill="currentColor" opacity="0.1" />
      <line x1="24" y1="33" x2="24" y2="40" />
      <ellipse cx="24" cy="41" rx="7" ry="2" />
    </svg>
  );
}

export function BubblesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 6h10l-.8 20c-.3 4-1.8 9-4.2 11-2.4-2-3.9-7-4.2-11L19 6z" />
      <line x1="24" y1="37" x2="24" y2="42" />
      <ellipse cx="24" cy="43" rx="5" ry="1.5" />
      <circle cx="23" cy="28" r="1" opacity="0.5" />
      <circle cx="25.5" cy="24" r="0.8" opacity="0.4" />
      <circle cx="23.5" cy="20" r="0.6" opacity="0.3" />
      <circle cx="25" cy="16" r="0.5" opacity="0.2" />
    </svg>
  );
}

export function GiftBoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="18" width="32" height="22" rx="2" />
      <rect x="6" y="12" width="36" height="8" rx="2" />
      <line x1="24" y1="12" x2="24" y2="40" />
      <line x1="6" y1="16" x2="42" y2="16" />
      <path d="M24 12c0 0-4-4-6-5.5-1.5-1.2-1-3 .5-3.5 1.5-.5 3 .5 4 2.5.5 1 1 3.5 1.5 6.5z" />
      <path d="M24 12c0 0 4-4 6-5.5 1.5-1.2 1-3-.5-3.5-1.5-.5-3 .5-4 2.5-.5 1-1 3.5-1.5 6.5z" />
    </svg>
  );
}

export function TuscanyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="24" y1="42" x2="24" y2="18" />
      <path d="M24 4c0 0-6 6-6 14 0 5 2.5 8 6 11 3.5-3 6-6 6-11 0-8-6-14-6-14z" fill="currentColor" opacity="0.08" />
      <path d="M24 4c0 0-6 6-6 14 0 5 2.5 8 6 11 3.5-3 6-6 6-11 0-8-6-14-6-14z" />
      <line x1="20" y1="42" x2="28" y2="42" />
    </svg>
  );
}
