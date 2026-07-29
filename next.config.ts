import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

    const cspValue = isProduction
      ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://storage.ko-fi.com https://ko-fi.com; style-src 'self' 'unsafe-inline' https://storage.ko-fi.com https://fonts.googleapis.com; img-src 'self' data: blob: https://picsum.photos https://storage.ko-fi.com https://ko-fi.com; font-src 'self' data: https://fonts.gstatic.com https://storage.ko-fi.com; connect-src 'self' https://ko-fi.com https://storage.ko-fi.com; frame-src 'self' https://ko-fi.com https://storage.ko-fi.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://docs.google.com https://*.google.com;"
      : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://storage.ko-fi.com https://ko-fi.com; style-src 'self' 'unsafe-inline' https://storage.ko-fi.com https://fonts.googleapis.com; img-src 'self' data: blob: https://picsum.photos https://storage.ko-fi.com https://ko-fi.com; font-src 'self' data: https://fonts.gstatic.com https://storage.ko-fi.com; connect-src 'self' https://ko-fi.com https://storage.ko-fi.com; frame-src 'self' https://ko-fi.com https://storage.ko-fi.com; frame-ancestors 'self' https://ai.studio https://*.google.com https://*.googleusercontent.com; object-src 'none'; base-uri 'self'; form-action 'self' https://docs.google.com https://*.google.com;";

    const xFrameValue = isProduction ? 'DENY' : 'SAMEORIGIN';

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspValue,
          },
          {
            key: 'X-Frame-Options',
            value: xFrameValue,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  webpack: (config, {dev}) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
