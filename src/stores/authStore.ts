"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

type AuthView = "login" | "register" | "recover" | "recover-sent";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  showLoginModal: boolean;
  loginRedirectAction: (() => void) | null;
  authView: AuthView;
  authError: string | null;

  setHydrated: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchCustomer: () => Promise<void>;
  openLoginModal: (redirectAction?: () => void) => void;
  closeLoginModal: () => void;
  setAuthView: (view: AuthView) => void;
  setAuthError: (error: string | null) => void;
  recoverPassword: (email: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      isLoading: false,
      showLoginModal: false,
      loginRedirectAction: null,
      authView: "login" as AuthView,
      authError: null,

      setHydrated: () => set({ isHydrated: true }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, authError: null });
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            set({ isLoading: false, authError: data.error });
            return false;
          }

          // Fetch customer data after login
          await get().fetchCustomer();

          const { loginRedirectAction } = get();
          set({ isLoading: false, showLoginModal: false, loginRedirectAction: null });
          loginRedirectAction?.();
          return true;
        } catch {
          set({ isLoading: false, authError: "Er ging iets mis. Probeer het later opnieuw." });
          return false;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, authError: null });
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const result = await res.json();

          if (!res.ok) {
            set({ isLoading: false, authError: result.error });
            return false;
          }

          // Fetch customer data after registration
          await get().fetchCustomer();

          const { loginRedirectAction } = get();
          set({ isLoading: false, showLoginModal: false, loginRedirectAction: null });
          loginRedirectAction?.();
          return true;
        } catch {
          set({ isLoading: false, authError: "Er ging iets mis. Probeer het later opnieuw." });
          return false;
        }
      },

      logout: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch {
          // Ignore — cookie will expire anyway
        }
        set({ user: null, isAuthenticated: false });
      },

      fetchCustomer: async () => {
        try {
          const res = await fetch("/api/auth/me");
          if (!res.ok) {
            set({ user: null, isAuthenticated: false });
            return;
          }

          const data = await res.json();
          if (data.customer) {
            set({
              user: {
                id: data.customer.id,
                email: data.customer.email,
                firstName: data.customer.firstName ?? "",
                lastName: data.customer.lastName ?? "",
              },
              isAuthenticated: true,
            });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      recoverPassword: async (email: string) => {
        set({ isLoading: true, authError: null });
        try {
          const res = await fetch("/api/auth/recover", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          await res.json();
          set({ isLoading: false, authView: "recover-sent" });
          return true;
        } catch {
          set({ isLoading: false, authError: "Er ging iets mis. Probeer het later opnieuw." });
          return false;
        }
      },

      openLoginModal: (redirectAction) => {
        set({
          showLoginModal: true,
          loginRedirectAction: redirectAction || null,
          authView: "login",
          authError: null,
        });
      },

      closeLoginModal: () => {
        set({
          showLoginModal: false,
          loginRedirectAction: null,
          authView: "login",
          authError: null,
        });
      },

      setAuthView: (view) => set({ authView: view, authError: null }),
      setAuthError: (error) => set({ authError: error }),
    }),
    {
      name: "vpl-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
