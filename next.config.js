/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
      net: require.resolve('net-browserify'),
      tls: require.resolve('tls-browserify'),
      fs: false,
      child_process: false,
      http2: false,
      dns: false,
      path: false,
      os: false,
    };
    return config;
  },
  env: {
    GOOGLE_SHEET_ID: '1TyUD5Tl3aUshg3IuH0HFNWeHs1TrmWZpGGkDRufdoeQ',
  },
}

module.exports = nextConfig;