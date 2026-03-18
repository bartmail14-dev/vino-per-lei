"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for debugging but never expose error.message or stack traces
    // in the rendered UI — only generic messages are shown to users.
    console.error("Application error:", error.digest ?? "unknown");
  }, [error]);

  return (
    <div className="bg-background min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        {/* Error icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-error" strokeWidth={1.5} />
          </div>
        </div>

        <p className="text-label text-gold mb-3">Er ging iets mis</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal mb-4">
          Oeps, een kurk klem...
        </h1>
        <p className="text-grey mb-8 leading-relaxed">
          Er is een onverwachte fout opgetreden. Probeer het opnieuw of ga
          terug naar de homepage. Als het probleem aanhoudt, neem dan contact
          met ons op.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center h-12 px-8 bg-wine text-white text-button uppercase rounded hover:bg-wine-dark transition-colors"
          >
            Probeer Opnieuw
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center h-12 px-8 border-2 border-wine text-wine text-button uppercase rounded hover:bg-wine hover:text-white transition-colors"
          >
            Naar Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
