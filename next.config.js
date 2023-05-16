/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, _) => ({
    ...config,
    watchOptions: {
      ...config.watchOptions,
      ignored: "**/node_modules",
      poll: 1000,
      aggregateTimeout: 500,
    },
    experiments: {
      layers: true,
      asyncWebAssembly: true,
    },
  }),
};

module.exports = nextConfig;
