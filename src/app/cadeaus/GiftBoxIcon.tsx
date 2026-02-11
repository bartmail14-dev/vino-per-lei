export function GiftBoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="18" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="6" y="12" width="36" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M24 12V42" stroke="currentColor" strokeWidth="3" opacity="0.4" />
      <path d="M6 16H42" stroke="currentColor" strokeWidth="3" opacity="0.4" />
      <path d="M18 12C18 8 20 6 24 6C28 6 30 8 30 12" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
      <circle cx="24" cy="12" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
