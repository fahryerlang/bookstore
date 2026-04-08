import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Singleton Prisma Client untuk menghindari pembuatan koneksi berulang
 * saat hot-reload di lingkungan development.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const requiredDelegates = ["user", "category", "book", "order", "invoice", "expense"] as const;

function hasRequiredDelegates(client: PrismaClient | undefined): client is PrismaClient {
  if (!client) {
    return false;
  }

  return requiredDelegates.every((delegateName) => delegateName in client);
}

function createPrismaClient() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
  return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
  const cachedPrisma = globalForPrisma.prisma;

  if (hasRequiredDelegates(cachedPrisma)) {
    return cachedPrisma;
  }

  return createPrismaClient();
}

const stalePrisma = globalForPrisma.prisma;

if (stalePrisma) {
  const isFreshClient = requiredDelegates.every((delegateName) => delegateName in stalePrisma);

  if (!isFreshClient) {
    void stalePrisma.$disconnect().catch(() => undefined);
    globalForPrisma.prisma = undefined;
  }
}

const prisma = getPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
