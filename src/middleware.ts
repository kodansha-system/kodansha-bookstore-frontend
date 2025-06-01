import { NextRequest, NextResponse } from "next/server";

import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales, protectedPathnames } from "@/config";

const intlMiddleware = createMiddleware({
  locales,
  localePrefix: "always",
  defaultLocale,
});

function isProtectedPath(pathname: string): boolean {
  return Object.values(protectedPathnames).some((protectedPath) =>
    locales.some((locale) => pathname.startsWith(`/${locale}${protectedPath}`)),
  );
}

function decodePayload(token: string): any | null {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload);

    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isProtectedPath(pathname)) {
    return intlMiddleware(req);
  }

  const token = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const payload = token ? decodePayload(token) : null;
  const now = Math.floor(Date.now() / 1000);

  const isAccessTokenInvalid = !payload || !payload.exp || payload.exp < now;

  if (isAccessTokenInvalid && !refreshToken) {
    const loginUrl = new URL(`/${defaultLocale}/login`, req.url);

    loginUrl.searchParams.set("reason", "unauthorized");

    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
