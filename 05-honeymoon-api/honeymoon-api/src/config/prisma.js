'use strict';
const { PrismaClient } = require('@prisma/client');

/* Prevent multiple Prisma instances in hot-reload (development) */
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
});

/* Reuse one client per warm instance (dev hot-reload + Vercel serverless). */
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL === '1') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
