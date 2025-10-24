import { PrismaClient } from "@prisma/client";

// Use a global variable so Prisma is not reinitialized on every hot reload in dev.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],

    // Helps stabilize Neon pooled connections
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Ensure a single Prisma instance during dev
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
