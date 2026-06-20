import { prisma } from './lib/prisma';

async function main() {
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
