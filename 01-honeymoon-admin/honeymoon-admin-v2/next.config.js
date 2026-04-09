/** @type {import('next').NextConfig} */
// Standalone is only for Docker (see Dockerfile DOCKER_BUILD=1). Vercel must use default output or routes 404.
const useStandalone = process.env.DOCKER_BUILD === '1';

module.exports = {
  ...(useStandalone ? { output: 'standalone' } : {}),
  env: { NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1' },
};
