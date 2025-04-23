"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  books_cart: any;
  books_order: any;
  address: any;
  setCart: (user: any) => void;
  setBookToBuy: (user: any) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      books_cart: [],
      books_order: [],
      address: null,
      setAddress: (address: any) => set({ address }),
      setCart: (books) => set({ books_cart: books }),
      setBookToBuy: (books) => set({ books_order: books }),
    }),
    { name: "cart-storage" },
  ),
);
