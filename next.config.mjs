import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/vi/api/v2/:path*",
        destination:
          process.env.NEXT_PUBLIC_SHIPPING_BASE_URL + "/api/v2/:path*",
      },
    ];
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets-prd.ignimgs.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "danviet.mediacdn.vn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "salt.tikicdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.haitrieu.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
