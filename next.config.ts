import type { NextConfig } from "next";
const config: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/examples", destination: "/playground", permanent: true },
    ];
  },
  poweredByHeader: false,
  devIndicators: false,
};
export default config;
