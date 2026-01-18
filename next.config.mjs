import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get git info
function getGitInfo() {
    try {
        const sha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
        return { sha, branch };
    } catch {
        // If git is not available or not in a git repo, return fallback values
        return { sha: 'dev-sha', branch: 'dev-branch' };
    }
}

const { sha, branch } = getGitInfo();

/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    turbopack: {
        // Explicitly set root directory to silence the multiple lockfiles warning
        // This tells Next.js to use the current project directory as the root
        root: __dirname,
    },
    env: {
        NEXT_PUBLIC_GIT_SHA: sha,
        NEXT_PUBLIC_GIT_BRANCH: branch,
    },
};

export default nextConfig;
