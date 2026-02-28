/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['@xenova/transformers', 'jimp'],
    output: 'standalone',
};

export default nextConfig;
