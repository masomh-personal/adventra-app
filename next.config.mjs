// next.config.mjs
import { execSync } from 'child_process';

// Function to get the short git commit hash
const getGitCommitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    console.error('Error getting git commit hash:', e.message); // Log only the message for brevity
    return 'dev-sha'; // More specific fallback
  }
};

// Function to get the current git branch name
const getGitBranch = () => {
  try {
    // Execute git command to get the current branch name
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (e) {
    console.error('Error getting git branch:', e.message); // Log only the message
    // Fallback value if git command fails
    return 'dev-branch'; // More specific fallback
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Expose the git hash to the browser
    NEXT_PUBLIC_GIT_SHA: getGitCommitHash(),
    // Expose the git branch to the browser
    NEXT_PUBLIC_GIT_BRANCH: getGitBranch(),
  },
};

export default nextConfig;
