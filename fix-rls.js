const { PrismaClient } = require('@prisma/client');

async function main() {
  // Use DIRECT_URL for migrations/DDL
  const url = process.env.DIRECT_URL;
  if (!url) throw new Error("DIRECT_URL not found in environment");

  const prisma = new PrismaClient({
    datasources: {
      db: { url }
    }
  });

  try {
    console.log("Enabling RLS on FaqCategory...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "FaqCategory" ENABLE ROW LEVEL SECURITY;`);
    
    console.log("Enabling RLS on FaqItem...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "FaqItem" ENABLE ROW LEVEL SECURITY;`);

    console.log("RLS successfully enabled!");
  } catch (error) {
    console.error("Error enabling RLS:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
