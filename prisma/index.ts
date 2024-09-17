import { PrismaClient } from '@prisma/client';

// Ensure the global variable is properly typed in TypeScript
declare global {
  var prisma: PrismaClient | undefined;
}

// Check if we're in a production or development environment
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // In production, create a new PrismaClient
  prisma = new PrismaClient({
    log: ['error', 'warn'], // Log less in production for better performance and security
  });
} else {
  // In development, reuse the PrismaClient if it's already been created
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'], // Log everything in development
    });
  }
  prisma = global.prisma;
}

export default prisma;
