"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import {
  X as CloseIcon,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useUiCopy } from "@/components/providers";

function LoginForm() {
  const t = useUiCopy();
  const { login, isLoading, authError, setAuthView } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-charcoal mb-1">
          {t("auth.email_label")}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" strokeWidth={1.5} />
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full pl-10 pr-4 py-3 border border-sand rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-colors"
            placeholder="jouw@email.nl"
          />
        </div>
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-charcoal mb-1">
          {t("auth.password_label")}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" strokeWidth={1.5} />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full pl-10 pr-12 py-3 border border-sand rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-colors"
            placeholder={t("auth.password_label")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-grey hover:text-charcoal transition-colors"
            aria-label={showPassword ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {authError && (
        <p className="text-red-600 text-sm" role="alert">{authError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-wine text-white rounded-lg text-button uppercase hover:bg-wine-dark active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t("auth.login")}...
          </>
        ) : (
          t("auth.login")
        )}
      </button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => setAuthView("recover")}
          className="text-wine hover:text-wine-dark transition-colors"
        >
          {t("auth.forgot_password")}
        </button>
        <button
          type="button"
          onClick={() => setAuthView("register")}
          className="text-wine font-medium hover:text-wine-dark transition-colors"
        >
          {t("auth.register")}
        </button>
      </div>
    </form>
  );
}

function RegisterForm() {
  const t = useUiCopy();
  const { register, isLoading, authError, setAuthView } = useAuthStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({ email, password, firstName, lastName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="reg-firstname" className="block text-sm font-medium text-charcoal mb-1">
            {t("auth.firstname_label")}
          </label>
          <input
            id="reg-firstname"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
            className="w-full px-4 py-3 border border-sand rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-colors"
            placeholder={t("auth.firstname_label")}
          />
        </div>
        <div>
          <label htmlFor="reg-lastname" className="block text-sm font-medium text-charcoal mb-1">
            {t("auth.lastname_label")}
          </label>
          <input
            id="reg-lastname"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
            className="w-full px-4 py-3 border border-sand rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-colors"
            placeholder={t("auth.lastname_label")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-charcoal mb-1">
          {t("auth.email_label")}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" strokeWidth={1.5} />
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full pl-10 pr-4 py-3 border border-sand rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-colors"
            placeholder="jouw@email.nl"
          />
        </div>
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-charcoal mb-1">
          {t("auth.password_label")}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" strokeWidth={1.5} />
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full pl-10 pr-12 py-3 border border-sand rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-colors"
            placeholder={t("auth.password_min")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-grey hover:text-charcoal transition-colors"
            aria-label={showPassword ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-grey">{t("auth.password_min")}</p>
      </div>

      {authError && (
        <p className="text-red-600 text-sm" role="alert">{authError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-wine text-white rounded-lg text-button uppercase hover:bg-wine-dark active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t("auth.register")}...
          </>
        ) : (
          t("auth.register")
        )}
      </button>

      <p className="text-center text-sm text-grey">
        {t("auth.has_account")}{" "}
        <button
          type="button"
          onClick={() => setAuthView("login")}
          className="text-wine font-medium hover:text-wine-dark transition-colors"
        >
          {t("auth.login")}
        </button>
      </p>
    </form>
  );
}

function RecoverForm() {
  const t = useUiCopy();
  const { recoverPassword, isLoading, authError, setAuthView } = useAuthStore();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await recoverPassword(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button
        type="button"
        onClick={() => setAuthView("login")}
        className="flex items-center gap-1 text-sm text-grey hover:text-charcoal transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("auth.back_to_login")}
      </button>

      <p className="text-sm text-grey leading-relaxed">
        {t("auth.recover_description")}
      </p>

      <div>
        <label htmlFor="recover-email" className="block text-sm font-medium text-charcoal mb-1">
          {t("auth.email_label")}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" strokeWidth={1.5} />
          <input
            id="recover-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full pl-10 pr-4 py-3 border border-sand rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-colors"
            placeholder="jouw@email.nl"
          />
        </div>
      </div>

      {authError && (
        <p className="text-red-600 text-sm" role="alert">{authError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-wine text-white rounded-lg text-button uppercase hover:bg-wine-dark active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t("auth.recover_submitting")}
          </>
        ) : (
          t("auth.recover_submit")
        )}
      </button>
    </form>
  );
}

function RecoverSentView() {
  const t = useUiCopy();
  const { setAuthView } = useAuthStore();

  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <p className="text-sm text-grey leading-relaxed">
        {t("auth.recover_sent_message")}
      </p>
      <p className="text-sm text-grey">
        {t("auth.recover_check_spam")}
      </p>
      <button
        onClick={() => setAuthView("login")}
        className="w-full py-3 bg-wine text-white rounded-lg text-button uppercase hover:bg-wine-dark active:scale-[0.98] transition-all duration-200"
      >
        {t("auth.back_to_login")}
      </button>
    </div>
  );
}

const TITLE_KEYS: Record<string, string> = {
  login: "auth.title_login",
  register: "auth.title_register",
  recover: "auth.title_recover",
  "recover-sent": "auth.title_recover_sent",
};

export function LoginModal() {
  const t = useUiCopy();
  const { showLoginModal, closeLoginModal, authView } = useAuthStore();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showLoginModal) return;

    const timer = setTimeout(() => closeButtonRef.current?.focus(), 100);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLoginModal();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLoginModal, closeLoginModal]);

  return (
    <AnimatePresence>
      {showLoginModal && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLoginModal}
            aria-hidden="true"
          />

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
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={TITLE_KEYS[authView] ? t(TITLE_KEYS[authView]) : "Account"}
            >
              {/* Header */}
              <div className="relative bg-wine/5 p-6 text-center">
                <button
                  ref={closeButtonRef}
                  onClick={closeLoginModal}
                  className="absolute top-4 right-4 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-wine/10 rounded-full transition-colors duration-150"
                  aria-label="Sluiten"
                >
                  <CloseIcon className="w-5 h-5 text-charcoal" strokeWidth={1.5} />
                </button>

                <div className="w-12 h-12 bg-wine/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-wine" strokeWidth={1.5} />
                </div>

                <h2 className="font-serif text-xl font-semibold text-charcoal">
                  {TITLE_KEYS[authView] ? t(TITLE_KEYS[authView]) : "Account"}
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={authView}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {authView === "login" && <LoginForm />}
                    {authView === "register" && <RegisterForm />}
                    {authView === "recover" && <RecoverForm />}
                    {authView === "recover-sent" && <RecoverSentView />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
