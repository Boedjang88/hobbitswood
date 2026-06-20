import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Fallback to a dummy connection string if not provided so build doesn't crash
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/mydb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: 3, // Limit database connection pool size to prevent Supabase transaction pooler exhaustion
    idleTimeoutMillis: 1000, // Terminate idle clients after 1s to free up connections immediately
    connectionTimeoutMillis: 5000, // Timeout after 5s if connection cannot be established
  });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
