const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany();
  for (const p of products) {
    if (!p.images || p.images === '[]') {
      console.log(`Product ${p.slug} has no images: ${p.images}`);
    } else {
      try {
        const parsed = JSON.parse(p.images);
        if (parsed.some(img => img === "")) {
          console.log(`Product ${p.slug} has an empty string in images: ${p.images}`);
        }
      } catch (e) {
        console.log(`Product ${p.slug} has invalid JSON images: ${p.images}`);
      }
    }
  }
  console.log("Done checking images");
}
check();
