"use client";

import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null });
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
      },
    }),
    { name: "auth-storage" },
  ),
);
