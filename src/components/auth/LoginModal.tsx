"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { Button, Input } from "@/components/ui";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

type Tab = "login" | "register";

export function LoginModal() {
  const { showLoginModal, closeLoginModal, login, register } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    closeLoginModal();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Vul alle velden in");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        setError("Ongeldige inloggegevens");
      }
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !firstName) {
      setError("Vul alle verplichte velden in");
      return;
    }

    if (password.length < 6) {
      setError("Wachtwoord moet minimaal 6 tekens bevatten");
      return;
    }

    setIsLoading(true);
    try {
      const success = await register({ email, password, firstName, lastName });
      if (!success) {
        setError("Registratie mislukt");
      }
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showLoginModal && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-wine/5 p-6 text-center">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 hover:bg-wine/10 rounded-full transition-colors"
                  aria-label="Sluiten"
                >
                  <CloseIcon className="w-5 h-5 text-charcoal" />
                </button>

                <div className="w-12 h-12 bg-wine/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <HeartIcon className="w-6 h-6 text-wine" />
                </div>

                <h2 className="font-serif text-xl font-semibold text-charcoal">
                  {activeTab === "login" ? "Welkom terug" : "Account aanmaken"}
                </h2>
                <p className="text-sm text-grey mt-1">
                  {activeTab === "login"
                    ? "Log in om je verlanglijstje te beheren"
                    : "Maak een account aan voor je verlanglijstje"}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-sand">
                <button
                  onClick={() => {
                    setActiveTab("login");
                    setError(null);
                  }}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === "login"
                      ? "text-wine border-b-2 border-wine"
                      : "text-grey hover:text-charcoal"
                  }`}
                >
                  Inloggen
                </button>
                <button
                  onClick={() => {
                    setActiveTab("register");
                    setError(null);
                  }}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === "register"
                      ? "text-wine border-b-2 border-wine"
                      : "text-grey hover:text-charcoal"
                  }`}
                >
                  Registreren
                </button>
              </div>

              {/* Form */}
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                {activeTab === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label htmlFor="login-email" className="block text-sm font-medium text-charcoal mb-1">
                        E-mailadres
                      </label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="jouw@email.nl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="login-password" className="block text-sm font-medium text-charcoal mb-1">
                        Wachtwoord
                      </label>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          autoComplete="current-password"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-sand text-wine focus:ring-wine" />
                        <span className="text-grey">Onthoud mij</span>
                      </label>
                      <button type="button" className="text-wine hover:underline">
                        Wachtwoord vergeten?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      disabled={isLoading}
                    >
                      {isLoading ? "Bezig met inloggen..." : "Inloggen"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="register-firstName" className="block text-sm font-medium text-charcoal mb-1">
                          Voornaam *
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                          <Input
                            id="register-firstName"
                            type="text"
                            placeholder="Jan"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="pl-10"
                            autoComplete="given-name"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="register-lastName" className="block text-sm font-medium text-charcoal mb-1">
                          Achternaam
                        </label>
                        <Input
                          id="register-lastName"
                          type="text"
                          placeholder="Jansen"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          autoComplete="family-name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="register-email" className="block text-sm font-medium text-charcoal mb-1">
                        E-mailadres *
                      </label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="jouw@email.nl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="register-password" className="block text-sm font-medium text-charcoal mb-1">
                        Wachtwoord * <span className="text-grey font-normal">(min. 6 tekens)</span>
                      </label>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>

                    <div className="text-xs text-grey">
                      Door te registreren ga je akkoord met onze{" "}
                      <a href="/voorwaarden" className="text-wine hover:underline">
                        algemene voorwaarden
                      </a>{" "}
                      en{" "}
                      <a href="/privacy" className="text-wine hover:underline">
                        privacybeleid
                      </a>
                      .
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      disabled={isLoading}
                    >
                      {isLoading ? "Bezig met registreren..." : "Account aanmaken"}
                    </Button>
                  </form>
                )}

                {/* Social login */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-sand" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-grey">of ga verder met</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-sand rounded-lg hover:bg-sand/50 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span className="text-sm font-medium">Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-sand rounded-lg hover:bg-sand/50 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
