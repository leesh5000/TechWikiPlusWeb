/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // Remove standalone output and outputFileTracingRoot which can cause issues
  // output: 'standalone',
  // outputFileTracingRoot: path.join(__dirname, '../../'),

  // Add webpack configuration to handle worker issues
  webpack: (config, { isServer }) => {
    // Disable webpack cache which can cause worker issues
    config.cache = false

    // Set proper externals for server-side
    if (isServer) {
      config.externals.push('@node-rs/argon2', '@node-rs/bcrypt')
    }

    return config
  },

  // Increase memory limits for the build process
  experimental: {
    workerThreads: false,
    cpus: 1
  }
}

module.exports = nextConfig