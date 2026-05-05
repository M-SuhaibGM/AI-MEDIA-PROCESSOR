import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaMariaDb({
  host: process.env.HOST_NAME,
  port: 13815,
  user: "avnadmin",
  password: process.env.DATABASE_PASSWORD,
  database: "defaultdb",
  connectionLimit: 10,
  connectTimeout: 30000,
});


export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;