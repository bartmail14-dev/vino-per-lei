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

      login: async (email: string, _password: string) => {
        // Mock login - in production this would call an API
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // For demo: accept any email/password combo
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email,
          firstName: email.split("@")[0],
          lastName: "",
        };

        set({
          user: mockUser,
          isAuthenticated: true,
          showLoginModal: false,
        });

        // Execute redirect action if set
        const { loginRedirectAction } = get();
        if (loginRedirectAction) {
          loginRedirectAction();
          set({ loginRedirectAction: null });
        }

        return true;
      },

      register: async (data: RegisterData) => {
        // Mock registration - in production this would call an API
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockUser: User = {
          id: `user-${Date.now()}`,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        };

        set({
          user: mockUser,
          isAuthenticated: true,
          showLoginModal: false,
        });

        // Execute redirect action if set
        const { loginRedirectAction } = get();
        if (loginRedirectAction) {
          loginRedirectAction();
          set({ loginRedirectAction: null });
        }

        return true;
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
