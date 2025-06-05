"use client";

import { api } from "@/services/axios";
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
      logout: async () => {
        const res = await api.post("/auth/logout");

        set({ user: null });
        Cookies.remove("access_token");
      },
    }),
    { name: "auth-storage" },
  ),
);
