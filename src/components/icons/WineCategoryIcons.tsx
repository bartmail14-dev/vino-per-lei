// Wine category icons — custom line-art matching Lucide style (24x24, stroke 1.5)
// Each icon is a distinct glass shape so categories are instantly recognizable

export function RedWineIcon({ className }: { className?: string }) {
  // Bordeaux glass — wide bowl, medium stem
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3h8l-.5 4c-.3 2.5-1.8 5.5-3.5 7-1.7-1.5-3.2-4.5-3.5-7L8 3z" />
      <path d="M9.5 9c.3 1.5 1.3 3.5 2.5 5 1.2-1.5 2.2-3.5 2.5-5" fill="currentColor" opacity="0.15" />
      <line x1="12" y1="14" x2="12" y2="19" />
      <line x1="9" y1="19" x2="15" y2="19" />
    </svg>
  );
}

export function WhiteWineIcon({ className }: { className?: string }) {
  // Tulip glass — narrower, taller bowl (white wine specific shape)
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6l-.3 5c-.2 2-1.2 5-2.7 6.5-1.5-1.5-2.5-4.5-2.7-6.5L9 3z" />
      <path d="M10 8.5c.2 1.2 1 3 2 4.2 1-1.2 1.8-3 2-4.2" fill="currentColor" opacity="0.1" />
      <line x1="12" y1="14.5" x2="12" y2="19" />
      <line x1="9" y1="19" x2="15" y2="19" />
    </svg>
  );
}

export function RoseWineIcon({ className }: { className?: string }) {
  // Coupe glass — wide shallow bowl (classic rosé)
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 5h11c0 0-.5 3-2.5 5.5-1 1.2-2 1.8-3 2-1-.2-2-.8-3-2C7 8 6.5 5 6.5 5z" />
      <path d="M8 7.5c.5 1.5 1.5 3 3 4 1.5-1 2.5-2.5 3-4" fill="currentColor" opacity="0.1" />
      <line x1="12" y1="12.5" x2="12" y2="19" />
      <line x1="9" y1="19" x2="15" y2="19" />
    </svg>
  );
}

export function BubblesIcon({ className }: { className?: string }) {
  // Flute glass — tall narrow (champagne / prosecco)
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3h4l-.3 8c-.1 1.5-.7 3.5-1.7 4.5-1-1-1.6-3-1.7-4.5L10 3z" />
      <line x1="12" y1="15.5" x2="12" y2="19" />
      <line x1="9.5" y1="19" x2="14.5" y2="19" />
      <circle cx="11.5" cy="11" r="0.5" fill="currentColor" opacity="0.4" />
      <circle cx="12.5" cy="8.5" r="0.4" fill="currentColor" opacity="0.3" />
      <circle cx="11.8" cy="6" r="0.3" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function GiftBoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="12" rx="1.5" />
      <rect x="2" y="5" width="20" height="4" rx="1.5" />
      <line x1="12" y1="5" x2="12" y2="20" />
      <path d="M12 5c0 0-2.5-2.5-3.5-3-1-.5-1.5.5-.5 1.5 .8.8 2.5 1.5 4 1.5" />
      <path d="M12 5c0 0 2.5-2.5 3.5-3 1-.5 1.5.5.5 1.5-.8.8-2.5 1.5-4 1.5" />
    </svg>
  );
}

export function TuscanyIcon({ className }: { className?: string }) {
  // Cypress tree — iconic Tuscan landscape
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="8" />
      <path d="M12 3c0 0-3 3-3 7s1.5 4.5 3 6c1.5-1.5 3-2 3-6s-3-7-3-7z" fill="currentColor" opacity="0.08" />
      <path d="M12 3c0 0-3 3-3 7s1.5 4.5 3 6c1.5-1.5 3-2 3-6s-3-7-3-7z" />
      <line x1="10" y1="20" x2="14" y2="20" />
    </svg>
  );
}
