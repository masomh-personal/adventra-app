// next.config.mjs
import { execSync } from 'child_process';

// Function to get the short git commit hash
const getGitCommitHash = () => {
  try {
    // Execute git command to get the short hash
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    console.error('Error getting git commit hash:', e);
    // Fallback value if git command fails (e.g., not in a git repo, git not installed)
    return 'dev'; // Or 'unknown', or null
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add the env configuration here
  env: {
    // Expose the git hash to the browser
    NEXT_PUBLIC_GIT_SHA: getGitCommitHash(),
  },
};

export default nextConfig;
