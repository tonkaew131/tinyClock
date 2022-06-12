/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // ignoreBuildErrors: true,
    env: {
        APP_ENV: 'development' // development, production
    }
}

module.exports = nextConfig
