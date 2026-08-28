import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database on Supabase...");

  const sachin = await prisma.user.upsert({
    where: { email: "sachin@bugzilla.local" },
    update: {},
    create: {
      name: "Sachin",
      email: "sachin@bugzilla.local",
      role: "ADMIN",
    },
  });

  await prisma.project.upsert({
    where: { key: "CORE" },
    update: {},
    create: {
      key: "CORE",
      name: "Core Infrastructure",
      description: "Backend microservices and data pipelines",
    },
  });

  await prisma.project.upsert({
    where: { key: "UI" },
    update: {},
    create: {
      key: "UI",
      name: "Web Client Interface",
      description: "Next.js frontend user dashboard",
    },
  });

  await prisma.project.upsert({
    where: { key: "SEC" },
    update: {},
    create: {
      key: "SEC",
      name: "Auth & Cryptography",
      description: "Zero-knowledge encryption & key management",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });