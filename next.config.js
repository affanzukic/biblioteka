/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    concurrentFeatures: true,
    reactRoot: "concurrent"
  },
  images: {
    domains: [
      "wallpaperaccess.com",
      "cetvrta-gimnazija.edu.ba",
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
    ],
  },
};
