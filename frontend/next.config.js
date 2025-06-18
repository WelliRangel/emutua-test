/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lemonchiffon-chimpanzee-679612.hostingersite.com",
      },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig
