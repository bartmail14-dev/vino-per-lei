"use client";

import { useState } from "react";
import { z } from "zod";
import { useUiCopy } from "@/components/providers";

/** Read the CSRF token from the vpl_csrf cookie (set by middleware, SameSite=Lax). */
function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)vpl_csrf=([^;]*)/);
  return match ? match[1] : "";
}

const contactSchema = z.object({
  naam: z.string().min(2, "Naam is te kort").max(100, "Naam is te lang"),
  email: z.string().email("Ongeldig e-mailadres"),
  onderwerp: z.string().min(1, "Kies een onderwerp"),
  bericht: z.string().min(10, "Bericht is te kort").max(2000, "Bericht is te lang"),
});

export function ContactForm() {
  const t = useUiCopy();
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naam: formData.naam,
          email: formData.email,
          onderwerp: formData.onderwerp,
          bericht: formData.bericht,
          honeypot,
          _csrf: getCsrfToken(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
        setFormData({ naam: "", email: "", onderwerp: "", bericht: "" });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setErrorMessage(data.error || "Er ging iets mis. Probeer het later opnieuw.");
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
            {t("contact.success")}
          </p>
          <p className="text-success/80 text-sm mt-1">
            {t("contact.success_desc")}
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
              {t("contact.name_label")} *
            </label>
            <input
              type="text"
              id="naam"
              required
              value={formData.naam}
              onChange={(e) =>
                setFormData({ ...formData, naam: e.target.value })
              }
              className="w-full h-12 px-4 rounded-lg border border-sand bg-white text-charcoal placeholder:text-light-grey focus:border-gold/30 focus:ring-1 focus:ring-gold/50 outline-none transition-colors"
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
              {t("contact.email_label")} *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full h-12 px-4 rounded-lg border border-sand bg-white text-charcoal placeholder:text-light-grey focus:border-gold/30 focus:ring-1 focus:ring-gold/50 outline-none transition-colors"
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
            {t("contact.subject_label")} *
          </label>
          <select
            id="onderwerp"
            required
            value={formData.onderwerp}
            onChange={(e) =>
              setFormData({ ...formData, onderwerp: e.target.value })
            }
            className="w-full h-12 px-4 rounded-lg border border-sand bg-white text-charcoal focus:border-gold/30 focus:ring-1 focus:ring-gold/50 outline-none transition-colors"
          >
            <option value="">{t("contact.subject_label")}</option>
            <option value="bestelling">{t("contact.subject.order")}</option>
            <option value="product">Vraag over een product</option>
            <option value="verzending">Verzending & Levering</option>
            <option value="retour">Retourneren</option>
            <option value="wijnadvies">{t("contact.subject.advice")}</option>
            <option value="zakelijk">{t("contact.subject.business")}</option>
            <option value="overig">{t("contact.subject.other")}</option>
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
            {t("contact.message_label")} *
          </label>
          <textarea
            id="bericht"
            required
            rows={6}
            value={formData.bericht}
            onChange={(e) =>
              setFormData({ ...formData, bericht: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-sand bg-white text-charcoal placeholder:text-light-grey focus:border-gold/30 focus:ring-1 focus:ring-gold/50 outline-none transition-colors resize-y"
            placeholder="Hoe kunnen wij je helpen?"
          />
          {validationErrors.bericht && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.bericht}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center h-12 px-8 bg-wine text-white text-button uppercase rounded hover:bg-wine-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Verzenden..." : t("contact.submit")}
        </button>
      </form>
    </>
  );
}
