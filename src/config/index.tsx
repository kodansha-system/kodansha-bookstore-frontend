import { Pathnames } from "next-intl/navigation";

export const defaultLocale = "en";
export const locales = ["en", "vi"] as const;

export const protectedPathnames = {
  CART: "/cart",
  MY_ORDERS: "/my-order",
  PAYMENT: "/payment",
  PAYMENT_RESULT: "/payment-result",
  USER: "/user",
} satisfies Pathnames<typeof locales>;

export const publicPathnames = {
  "/signin": "/signin",
  "/signup": "/signup",
  "/forgot-password": "/forgot-password",
} satisfies Pathnames<typeof locales>;

export const pathnames = {
  "/": "/",
  "/signin": "/signin",
  "/signup": "/signup",
  "/forgot-password": "/forgot-password",
  "/user": "/dashboard",
  "/inspirations": "/settings",
  "/story": "/user",
} satisfies Pathnames<typeof locales>;

export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;
