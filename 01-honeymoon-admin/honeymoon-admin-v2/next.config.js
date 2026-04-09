/** @type {import('next').NextConfig} */
// Vercel sets VERCEL=1; standalone output is for Docker (see Dockerfile) and breaks Vercel routing if always on.
const useStandalone = process.env.VERCEL !== '1';

module.exports = {
  ...(useStandalone ? { output: 'standalone' } : {}),
  env: { NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1' },
};
