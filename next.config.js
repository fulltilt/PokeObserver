/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ["product-images.tcgplayer.com"],
  },
};

module.exports = nextConfig;
