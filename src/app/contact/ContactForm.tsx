"use client";

import { useState } from "react";
import { z } from "zod";

const contactSchema = z.object({
  naam: z.string().min(2, "Naam is te kort").max(100, "Naam is te lang"),
  email: z.string().email("Ongeldig e-mailadres"),
  onderwerp: z.string().min(1, "Kies een onderwerp"),
  bericht: z.string().min(10, "Bericht is te kort").max(2000, "Bericht is te lang"),
});

export function ContactForm() {
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    onderwerp: "",
    bericht: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot detected
    if (honeypot) return;

    // Validate with Zod
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      }
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `Vino per Lei — ${formData.onderwerp}`,
          from_name: formData.naam,
          name: formData.naam,
          email: formData.email,
          onderwerp: formData.onderwerp,
          message: formData.bericht,
          botcheck: honeypot,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setFormData({ naam: "", email: "", onderwerp: "", bericht: "" });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setErrorMessage("Er ging iets mis. Probeer het later opnieuw.");
      }
    } catch {
      setErrorMessage("Er ging iets mis. Controleer je internetverbinding.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSuccess && (
        <div className="mb-6 bg-success/10 border border-success/20 rounded-lg p-4">
          <p className="text-success font-semibold text-sm">
            Bedankt voor je bericht! Wij nemen zo snel mogelijk contact met je
            op.
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold text-sm">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot — hidden from real users, filled by bots */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="absolute opacity-0 -z-10 h-0 w-0"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="naam"
              className="block text-sm font-semibold text-charcoal mb-2"
            >
              Naam *
            </label>
            <input
              type="text"
              id="naam"
              required
              value={formData.naam}
              onChange={(e) =>
                setFormData({ ...formData, naam: e.target.value })
              }
              className="w-full h-12 px-4 rounded-lg border border-sand bg-white text-charcoal placeholder:text-light-grey focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-colors"
              placeholder="Je naam"
            />
            {validationErrors.naam && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.naam}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-charcoal mb-2"
            >
              E-mailadres *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full h-12 px-4 rounded-lg border border-sand bg-white text-charcoal placeholder:text-light-grey focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-colors"
              placeholder="je@email.nl"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="onderwerp"
            className="block text-sm font-semibold text-charcoal mb-2"
          >
            Onderwerp *
          </label>
          <select
            id="onderwerp"
            required
            value={formData.onderwerp}
            onChange={(e) =>
              setFormData({ ...formData, onderwerp: e.target.value })
            }
            className="w-full h-12 px-4 rounded-lg border border-sand bg-white text-charcoal focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-colors"
          >
            <option value="">Kies een onderwerp</option>
            <option value="bestelling">Vraag over mijn bestelling</option>
            <option value="product">Vraag over een product</option>
            <option value="verzending">Verzending & Levering</option>
            <option value="retour">Retourneren</option>
            <option value="wijnadvies">Wijnadvies</option>
            <option value="zakelijk">Zakelijk / Horeca</option>
            <option value="overig">Overig</option>
          </select>
          {validationErrors.onderwerp && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.onderwerp}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="bericht"
            className="block text-sm font-semibold text-charcoal mb-2"
          >
            Bericht *
          </label>
          <textarea
            id="bericht"
            required
            rows={6}
            value={formData.bericht}
            onChange={(e) =>
              setFormData({ ...formData, bericht: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-sand bg-white text-charcoal placeholder:text-light-grey focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-colors resize-y"
            placeholder="Hoe kunnen wij je helpen?"
          />
          {validationErrors.bericht && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.bericht}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center h-12 px-8 bg-wine text-white font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Verzenden..." : "Verstuur Bericht"}
        </button>
      </form>
    </>
  );
}
