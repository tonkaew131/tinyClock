/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // ignoreBuildErrors: true,
    images: {
        domains: [
            'i.scdn.co', // Spotify Album cover
        ]
    },
    env: {
        APP_ENV: 'development' // development, production
    }
}

module.exports = nextConfig
