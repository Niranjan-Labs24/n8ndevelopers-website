if (typeof process !== 'undefined' && typeof process.on === 'function') {
  process.on('warning', (warning) => {
    if (warning && (warning.code === 'DEP0169' || (warning.message && warning.message.includes('url.parse')))) {
      return;
    }
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {

  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
    ],
  },
}

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload' // HSTS Policy
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN' // Mitigates clickjacking
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
];

export default {
  ...nextConfig,
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: '/blogs/:path*',
        permanent: true,
      },
      {
        source: '/post/:path*',
        destination: '/blogs/:path*',
        permanent: true,
      },
      {
        source: '/posts/:path*',
        destination: '/blogs/:path*',
        permanent: true,
      },
      {
        source: '/article/:path*',
        destination: '/blogs/:path*',
        permanent: true,
      },
      {
        source: '/articles/:path*',
        destination: '/blogs/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
