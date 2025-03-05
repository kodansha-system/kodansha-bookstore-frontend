import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
};

export default withNextIntl(nextConfig);
