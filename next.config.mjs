import { execSync } from 'child_process';

const getGitCommitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    console.error('Error getting git commit hash:', e.message);
    return 'dev-sha';
  }
};

const getGitBranch = () => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (e) {
    console.error('Error getting git branch:', e.message);
    return 'dev-branch';
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GIT_SHA: getGitCommitHash(),
    NEXT_PUBLIC_GIT_BRANCH: getGitBranch(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fzrwhqfpkxeivapgywdz.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
};

export default nextConfig;
