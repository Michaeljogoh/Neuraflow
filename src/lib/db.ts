import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  pgPool: Pool;
};

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    connectionTimeoutMillis: 30_000,
    idleTimeoutMillis: 30_000,
  });
}

const pool = globalForPrisma.pgPool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pgPool = pool;
}

const adapter = new PrismaPg(pool);

function createPrismaClient() {
  return new PrismaClient({ adapter });
}

let prisma = globalForPrisma.prisma ?? createPrismaClient();

// Dev hot reload can keep a PrismaClient from before schema changes.
if (!("credential" in prisma)) {
  prisma = createPrismaClient();
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
