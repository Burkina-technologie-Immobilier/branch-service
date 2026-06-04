import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Utilisé comme singleton hors Nest (si jamais tu l'emploies ailleurs).
// Dans Nest, la source de vérité reste `PrismaService`.
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

export { prisma };