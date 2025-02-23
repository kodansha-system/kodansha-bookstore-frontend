import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/config";

const intlMiddleware = createMiddleware({
  locales,
  localePrefix: "always",
  defaultLocale,
});

export default function middleware(req: any) {
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Don't run middleware on static files
    "/", // Run middleware on index page
    "/(api|trpc)(.*)", // Run middleware on API routes
  ],
};
