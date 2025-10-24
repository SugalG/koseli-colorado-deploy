import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const username = "admin";
  const password = "admin123"; // change this before deployment!
  const hashed = await bcrypt.hash(password, 10);

  const existing = await prisma.adminUser.findUnique({ where: { username } });

  if (existing) {
    console.log("✅ Admin user already exists");
  } else {
    await prisma.adminUser.create({
      data: {
        username,
        password: hashed,
      },
    });
    console.log("🌱 Admin user created:", username);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
