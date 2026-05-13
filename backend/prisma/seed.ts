import "../src/config/env";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const superRole = await prisma.role.upsert({
    where: { name: "Super Admin" },
    update: {},
    create: {
      name: "Super Admin",
      description: "Full access",
      permissions: ["*"],
    },
  });

  await prisma.role.upsert({
    where: { name: "Content Editor" },
    update: {},
    create: {
      name: "Content Editor",
      description: "Manage site content without admin or role access",
      permissions: [
        "static_info",
        "privacy",
        "blogs",
        "partners",
        "portfolios",
        "testimonials",
        "services",
        "packages",
        "contacts",
        "seo",
        "upload_assets",
      ],
    },
  });

  const email =
    process.env.SEED_ADMIN_EMAIL?.toLowerCase() ?? "admin@mafateeh.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe_Admin123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, roleId: superRole.id, isActive: true },
    create: {
      email,
      passwordHash,
      name: "Primary Admin",
      roleId: superRole.id,
    },
  });

  if (!(await prisma.staticSiteInfo.findFirst())) {
    await prisma.staticSiteInfo.create({ data: {} });
  }
  if (!(await prisma.privacyPolicy.findFirst())) {
    await prisma.privacyPolicy.create({
      data: { content: "Update your privacy policy from the admin dashboard." },
    });
  }
  if (!(await prisma.sEOSettings.findFirst())) {
    await prisma.sEOSettings.create({ data: {} });
  }

  // eslint-disable-next-line no-console
  console.log("Seed complete. Admin login:", email, "/", password);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
