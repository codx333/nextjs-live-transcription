/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    swcMinify: true,
    forceSwcTransforms: true,
  },
  swcMinify: true,
};

module.exports = nextConfig;