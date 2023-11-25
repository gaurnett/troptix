/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  reactStrictMode: false,
  images: {
    domains: ["firebasestorage.googleapis.com", "placehold.co"],
  },
};

module.exports = nextConfig;
