import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        {/* Wine glass icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg
              className="w-24 h-24 text-wine/20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M8 2h8l-1 9a5 5 0 01-3 4.5M13 15.5a5 5 0 01-3-4.5L9 2" />
              <line x1="12" y1="16" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 font-serif text-4xl font-bold text-wine">
              404
            </span>
          </div>
        </div>

        <p className="text-label text-gold mb-3">Pagina niet gevonden</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal mb-4">
          Deze fles is leeg...
        </h1>
        <p className="text-grey mb-8 leading-relaxed">
          De pagina die je zoekt bestaat niet of is verplaatst. Maar geen
          zorgen — er zijn nog genoeg prachtige wijnen te ontdekken.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-8 bg-wine text-white text-button uppercase rounded hover:bg-wine-dark transition-colors"
          >
            Terug naar Home
          </Link>
          <Link
            href="/wijnen"
            className="inline-flex items-center justify-center h-12 px-8 border-2 border-wine text-wine text-button uppercase rounded hover:bg-wine hover:text-white transition-colors"
          >
            Bekijk Wijnen
          </Link>
        </div>
      </div>
    </div>
  );
}
