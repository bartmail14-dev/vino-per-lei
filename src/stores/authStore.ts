// PLACEHOLDER: This auth store is non-functional. There is no real auth backend.
// Login/register are disabled in the UI. The wishlist works via localStorage without auth.
// When a real auth backend is added, replace the mock login/register with actual API calls.
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  showLoginModal: boolean;
  loginRedirectAction: (() => void) | null;

  setHydrated: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  openLoginModal: (redirectAction?: () => void) => void;
  closeLoginModal: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      showLoginModal: false,
      loginRedirectAction: null,

      setHydrated: () => set({ isHydrated: true }),

      login: async (_email: string, _password: string) => {
        // Coming soon — no auth backend connected yet.
        // When a real auth provider is integrated, replace this stub.
        return false;
      },

      register: async (_data: RegisterData) => {
        // Coming soon — no auth backend connected yet.
        return false;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      openLoginModal: (redirectAction) => {
        set({
          showLoginModal: true,
          loginRedirectAction: redirectAction || null,
        });
      },

      closeLoginModal: () => {
        set({
          showLoginModal: false,
          loginRedirectAction: null,
        });
      },
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
