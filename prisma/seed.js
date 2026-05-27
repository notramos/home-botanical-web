const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");
const bcrypt = require("bcryptjs");

const url = "postgresql://neondb_owner:npg_Hdlvzj7L0GZE@ep-flat-thunder-aoykgroe-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const adapter = new PrismaNeon({ connectionString: url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@homebotanical.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@homebotanical.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log(`Admin: ${admin.email} / admin123`);

  const customer = await prisma.user.upsert({
    where: { email: "customer@test.com" },
    update: {},
    create: {
      name: "Test Customer",
      email: "customer@test.com",
      password: hashedPassword,
      role: "user",
    },
  });

  console.log(`Customer: ${customer.email} / admin123`);

  const products = [
    { name: "Monstera Deliciosa", slug: "monstera-deliciosa", price: 45.00, originalPrice: 55.00, stock: 15, sku: "MON-001", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80", category: "tropical", status: "active", plantType: "indoor", scientificName: "Monstera deliciosa", lightRequirement: "Bright indirect light", waterRequirement: "Every 1-2 weeks", isFeatured: true },
    { name: "Fiddle Leaf Fig", slug: "fiddle-leaf-fig", price: 85.00, stock: 8, sku: "FLF-001", image: "https://images.unsplash.com/photo-1612360520697-393f6b96e499?auto=format&fit=crop&w=800&q=80", category: "tropical", status: "active", plantType: "indoor", scientificName: "Ficus lyrata", lightRequirement: "Bright indirect light", waterRequirement: "Every 1-2 weeks", isFeatured: true },
    { name: "Snake Plant", slug: "snake-plant", price: 28.00, originalPrice: 35.00, stock: 25, sku: "SNK-001", image: "https://images.unsplash.com/photo-1616690248297-15d6a2f357f8?auto=format&fit=crop&w=800&q=80", category: "succulents", status: "active", plantType: "indoor", scientificName: "Sansevieria trifasciata", lightRequirement: "Low to bright indirect light", waterRequirement: "Every 2-3 weeks", isFeatured: true },
    { name: "ZZ Plant", slug: "zz-plant", price: 42.00, stock: 12, sku: "ZZ-001", image: "https://images.unsplash.com/photo-1637967886160-fd78dc3eb495?auto=format&fit=crop&w=800&q=80", category: "succulents", status: "active", plantType: "indoor", scientificName: "Zamioculcas zamiifolia", lightRequirement: "Low to bright indirect light", waterRequirement: "Every 2-3 weeks", isFeatured: true },
    { name: "Golden Pothos", slug: "golden-pothos", price: 22.00, stock: 30, sku: "PTH-001", image: "https://images.unsplash.com/photo-1551500212-2f08fc0e87f4?auto=format&fit=crop&w=800&q=80", category: "tropical", status: "active", plantType: "indoor", scientificName: "Epipremnum aureum", lightRequirement: "Low to bright indirect light", waterRequirement: "Every 1-2 weeks", isFeatured: false },
    { name: "Peace Lily", slug: "peace-lily", price: 35.00, stock: 18, sku: "PCL-001", image: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80", category: "flowering", status: "active", plantType: "indoor", scientificName: "Spathiphyllum wallisii", lightRequirement: "Low to medium indirect light", waterRequirement: "Every 1 week", isFeatured: false },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
