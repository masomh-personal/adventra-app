import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    turbopack: {
        // Explicitly set root directory to silence the multiple lockfiles warning
        // This tells Next.js to use the current project directory as the root
        root: __dirname,
    },
};

export default nextConfig;
