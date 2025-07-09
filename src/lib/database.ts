import { PrismaClient } from '@prisma/client';
import { getSecret } from './secrets';

let prisma: PrismaClient | null = null;

/**
 * Get a Prisma client instance with database URL from Google Secret Manager
 */
export async function getPrismaClient(): Promise<PrismaClient> {
  if (prisma) {
    return prisma;
  }

  try {
    // Get database URL from Google Secret Manager
    const databaseUrl = await getSecret('DATABASE_URL');
    
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    return prisma;
  } catch (error) {
    console.error('Failed to get database URL from Google Secret Manager:', error);
    throw new Error('Failed to initialize database connection: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

/**
 * Close the Prisma client connection
 */
export async function closePrismaClient(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}

/**
 * Get a singleton Prisma client instance
 * Use this for most cases where you need database access
 */
export async function getDatabase(): Promise<PrismaClient> {
  return getPrismaClient();
} 