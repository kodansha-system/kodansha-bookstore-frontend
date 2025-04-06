"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  books: any;
  setCart: (user: any) => void;
  setBookToBuy: (user: any) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      books: [],
      setCart: (books) => set({ books }),
      setBookToBuy: (books) => set({ books }),
    }),
    { name: "cart-storage" },
  ),
);
