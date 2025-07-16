import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
