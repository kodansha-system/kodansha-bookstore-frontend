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
    const json = Buffer.from(payload, "base64").toString("utf-8"); // an toàn hơn atob

    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const payload = token ? decodePayload(token) : null;
  const now = Math.floor(Date.now() / 1000);

  const isAccessTokenInvalid = !payload || !payload.exp || payload.exp < now;

  if (isProtectedPath(pathname)) {
    if (isAccessTokenInvalid && !refreshToken) {
      const loginUrl = new URL(`/${defaultLocale}/login`, req.url);

      loginUrl.searchParams.set("reason", "unauthorized");

      return NextResponse.redirect(loginUrl);
    }
  }

  const response = intlMiddleware(req); // Gọi xử lý locale

  response.headers.set("x-pathname", pathname); // Đặt header để dùng trong layout

  return response;
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
