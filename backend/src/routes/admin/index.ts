import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { signToken } from "../../lib/jwt";
import { HttpError } from "../../lib/httpError";
import { uniqueSlug } from "../../lib/slug";
import { estimateBlogReadTimeMinutes } from "../../lib/readTime";
import { isIconifyIconId } from "../../lib/iconify";
import { normalizeMultiline } from "../../lib/multiline";
import { sanitizeBlogHtml, sanitizeRichHtml, stripHtmlToPlainText } from "../../lib/blogHtml";
import { PERMISSIONS, hasPermission, parsePermissions } from "../../lib/permissions";
import { uploadBuffer, initCloudinary } from "../../lib/cloudinary";
import { cloudinaryConfigured } from "../../config/env";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAuth, type AuthedRequest } from "../../middleware/auth";
import { requirePermission } from "../../middleware/requirePermission";
import { uploadMemory } from "../../middleware/upload";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const allowedPermSet = new Set<string>([...PERMISSIONS, "*"]);

function assertPermissions(raw: unknown): string[] {
  const arr = z.array(z.string()).parse(raw);
  for (const p of arr) {
    if (!allowedPermSet.has(p)) {
      throw new HttpError(400, `Invalid permission: ${p}`);
    }
  }
  return arr;
}

const adminRouter = Router();

adminRouter.post(
  "/auth/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);
    const admin = await prisma.admin.findUnique({
      where: { email: body.email.toLowerCase() },
      include: { role: true },
    });
    if (!admin || !admin.isActive) {
      throw new HttpError(401, "Invalid credentials");
    }
    const ok = await bcrypt.compare(body.password, admin.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid credentials");
    const token = signToken({
      sub: admin.id,
      email: admin.email,
      roleId: admin.roleId,
    });
    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: {
          ...admin.role,
          permissions: parsePermissions(admin.role.permissions),
        },
      },
    });
  })
);

adminRouter.get(
  "/auth/me",
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.id },
      include: { role: true },
    });
    if (!admin) throw new HttpError(401, "Unauthorized");
    res.json({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      isActive: admin.isActive,
      role: {
        ...admin.role,
        permissions: parsePermissions(admin.role.permissions),
      },
    });
  })
);

adminRouter.use(requireAuth);

adminRouter.post(
  "/upload",
  requirePermission("upload_assets"),
  uploadMemory.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file?.buffer) {
      throw new HttpError(400, "file is required (multipart field: file)");
    }
    const folder =
      typeof req.query.folder === "string" && req.query.folder.length > 0
        ? req.query.folder.replace(/[^a-z0-9-_]/gi, "")
        : "misc";
    initCloudinary();
    const uploaded = await uploadBuffer(req.file.buffer, folder);
    res.status(201).json(uploaded);
  })
);

adminRouter.get(
  "/health/cloudinary",
  asyncHandler(async (_req, res) => {
    res.json({ configured: cloudinaryConfigured() });
  })
);

/** Singleton helpers */
async function getOrCreateStatic() {
  let row = await prisma.staticSiteInfo.findFirst();
  if (!row) {
    row = await prisma.staticSiteInfo.create({ data: {} });
  }
  return row;
}

async function getOrCreatePrivacy() {
  let row = await prisma.privacyPolicy.findFirst();
  if (!row) {
    row = await prisma.privacyPolicy.create({ data: { content: "", contentAr: "" } });
  }
  return row;
}

function toPrivacyPolicyResponse(row: Awaited<ReturnType<typeof getOrCreatePrivacy>>) {
  return {
    ...row,
    content: sanitizeRichHtml(row.content, { extended: true }),
    contentAr: sanitizeRichHtml(row.contentAr, { extended: true }),
  };
}

async function getOrCreateSeo() {
  let row = await prisma.sEOSettings.findFirst();
  if (!row) {
    row = await prisma.sEOSettings.create({ data: {} });
  }
  return row;
}

const staticSchema = z.object({
  logoUrl: z.string().max(2048).optional().nullable(),
  phoneNumber: z.string().max(100).optional().nullable(),
  address: z
    .string()
    .max(2000)
    .optional()
    .nullable()
    .transform((v) => (v == null ? v : normalizeMultiline(v))),
  addressAr: z.string().min(1).max(2000).transform(normalizeMultiline),
  businessHours: z
    .string()
    .max(2000)
    .optional()
    .nullable()
    .transform((v) => (v == null ? v : normalizeMultiline(v))),
  email: z.string().email().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  socialInstagram: z.string().max(2048).optional().nullable(),
  socialFacebook: z.string().max(2048).optional().nullable(),
  socialLinkedin: z.string().max(2048).optional().nullable(),
  socialYoutube: z.string().max(2048).optional().nullable(),
});

adminRouter.get(
  "/static-site-info",
  requirePermission("static_info"),
  asyncHandler(async (_req, res) => {
    res.json(await getOrCreateStatic());
  })
);

adminRouter.put(
  "/static-site-info",
  requirePermission("static_info"),
  asyncHandler(async (req, res) => {
    const data = staticSchema.parse(req.body);
    const existing = await getOrCreateStatic();
    const row = await prisma.staticSiteInfo.update({
      where: { id: existing.id },
      data,
    });
    res.json(row);
  })
);

adminRouter.get(
  "/privacy-policy",
  requirePermission("privacy"),
  asyncHandler(async (_req, res) => {
    res.json(toPrivacyPolicyResponse(await getOrCreatePrivacy()));
  })
);

adminRouter.put(
  "/privacy-policy",
  requirePermission("privacy"),
  asyncHandler(async (req, res) => {
    const privacyContent = z
      .string()
      .min(1)
      .transform((s) => sanitizeRichHtml(s, { extended: true }))
      .refine((s) => stripHtmlToPlainText(s).length > 0, "Content is required");

    const data = z
      .object({
        content: privacyContent,
        contentAr: privacyContent,
      })
      .parse(req.body);
    const existing = await getOrCreatePrivacy();
    const row = await prisma.privacyPolicy.update({
      where: { id: existing.id },
      data,
    });
    res.json(toPrivacyPolicyResponse(row));
  })
);

adminRouter.get(
  "/seo",
  requirePermission("seo"),
  asyncHandler(async (_req, res) => {
    res.json(await getOrCreateSeo());
  })
);

adminRouter.put(
  "/seo",
  requirePermission("seo"),
  asyncHandler(async (req, res) => {
    const data = z
      .object({
        googleTagId: z.string().max(200).optional().nullable(),
        metaTitle: z.string().max(200).optional().nullable(),
        metaDescription: z
          .string()
          .max(2000)
          .optional()
          .nullable()
          .transform((v) => (v == null ? v : normalizeMultiline(v))),
        metaKeywords: z.string().max(500).optional().nullable(),
        ogImageUrl: z.string().max(2048).optional().nullable(),
      })
      .parse(req.body);
    const existing = await getOrCreateSeo();
    const row = await prisma.sEOSettings.update({
      where: { id: existing.id },
      data,
    });
    res.json(row);
  })
);

/** Tags */
const tagWrite = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(160).optional(),
});

adminRouter.get(
  "/tags",
  requirePermission("blogs"),
  asyncHandler(async (_req, res) => {
    res.json(await prisma.tag.findMany({ orderBy: { name: "asc" } }));
  })
);

adminRouter.post(
  "/tags",
  requirePermission("blogs"),
  asyncHandler(async (req, res) => {
    const body = tagWrite.parse(req.body);
    const slug =
      body.slug ??
      (await uniqueSlug(body.name, async (s) => {
        const x = await prisma.tag.findUnique({ where: { slug: s } });
        return Boolean(x);
      }));
    const row = await prisma.tag.create({
      data: { name: body.name, slug },
    });
    res.status(201).json(row);
  })
);

adminRouter.put(
  "/tags/:id",
  requirePermission("blogs"),
  asyncHandler(async (req, res) => {
    const body = tagWrite.partial().parse(req.body);
    const existing = await prisma.tag.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new HttpError(404, "Tag not found");
    let slug = existing.slug;
    if (body.name && !body.slug) {
      slug = await uniqueSlug(body.name, async (s) => {
        const x = await prisma.tag.findFirst({
          where: { slug: s, NOT: { id: existing.id } },
        });
        return Boolean(x);
      });
    } else if (body.slug) {
      const clash = await prisma.tag.findFirst({
        where: { slug: body.slug, NOT: { id: existing.id } },
      });
      if (clash) throw new HttpError(409, "Slug already in use");
      slug = body.slug;
    }
    const row = await prisma.tag.update({
      where: { id: existing.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        slug,
      },
    });
    res.json(row);
  })
);

adminRouter.delete(
  "/tags/:id",
  requirePermission("blogs"),
  asyncHandler(async (req, res) => {
    await prisma.tag.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

/** Blog categories */
const blogCatSchema = z.object({
  name: z.string().min(1).max(200),
  nameAr: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
});

adminRouter.get(
  "/blog-categories",
  requirePermission("blogs"),
  asyncHandler(async (_req, res) => {
    res.json(await prisma.blogCategory.findMany({ orderBy: { name: "asc" } }));
  })
);

adminRouter.post(
  "/blog-categories",
  requirePermission("blogs"),
  asyncHandler(async (req, res) => {
    const body = blogCatSchema.parse(req.body);
    const slug =
      body.slug ??
      (await uniqueSlug(body.name, async (s) => {
        return Boolean(await prisma.blogCategory.findUnique({ where: { slug: s } }));
      }));
    const row = await prisma.blogCategory.create({
      data: { name: body.name, nameAr: body.nameAr, slug },
    });
    res.status(201).json(row);
  })
);

adminRouter.put(
  "/blog-categories/:id",
  requirePermission("blogs"),
  asyncHandler(async (req, res) => {
    const body = blogCatSchema.parse(req.body);
    const existing = await prisma.blogCategory.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new HttpError(404, "Category not found");
    let slug = existing.slug;
    if (body.slug) {
      const clash = await prisma.blogCategory.findFirst({
        where: { slug: body.slug, NOT: { id: existing.id } },
      });
      if (clash) throw new HttpError(409, "Slug already in use");
      slug = body.slug;
    } else {
      slug = await uniqueSlug(body.name, async (s) => {
        return Boolean(
          await prisma.blogCategory.findFirst({
            where: { slug: s, NOT: { id: existing.id } },
          })
        );
      });
    }
    const row = await prisma.blogCategory.update({
      where: { id: existing.id },
      data: {
        name: body.name,
        nameAr: body.nameAr,
        slug,
      },
    });
    res.json(row);
  })
);

adminRouter.delete(
  "/blog-categories/:id",
  requirePermission("blogs"),
  asyncHandler(async (req, res) => {
    await prisma.blogCategory.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

/** Blogs */
const blogWrite = z.object({
  categoryId: z.string(),
  title: z.string().min(1).max(300),
  titleAr: z.string().min(1),
  content: z
    .string()
    .min(1)
    .transform(sanitizeBlogHtml)
    .refine((s) => stripHtmlToPlainText(s).length > 0, "Content is required"),
  contentAr: z
    .string()
    .min(1)
    .transform(sanitizeBlogHtml)
    .refine((s) => stripHtmlToPlainText(s).length > 0, "Arabic content is required"),
  featuredImageUrl: z.string().max(2048).optional().nullable(),
  published: z.boolean().optional(),
  tagIds: z.array(z.string()).optional(),
});

adminRouter.get(
  "/blogs",
  requirePermission("blogs"),
  asyncHandler(async (_req, res) => {
    const rows = await prisma.blog.findMany({
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(rows);
  })
);

adminRouter.post(
  "/blogs",
  requirePermission("blogs"),
  asyncHandler(async (req, res) => {
    const body = blogWrite.parse(req.body);
    const slug = await uniqueSlug(body.title, async (s) => {
      return Boolean(await prisma.blog.findUnique({ where: { slug: s } }));
    });
    const { tagIds, ...rest } = body;
    const readTime = estimateBlogReadTimeMinutes(rest.content, rest.contentAr);
    const blog = await prisma.blog.create({
      data: {
        categoryId: rest.categoryId,
        title: rest.title,
        titleAr: rest.titleAr,
        slug,
        content: rest.content,
        contentAr: rest.contentAr,
        readTime,
        featuredImageUrl: rest.featuredImageUrl ?? undefined,
        published: rest.published ?? false,
      },
    });
    if (tagIds?.length) {
      await prisma.blogTag.createMany({
        data: tagIds.map((tagId) => ({ blogId: blog.id, tagId })),
        skipDuplicates: true,
      });
    }
    const full = await prisma.blog.findUnique({
      where: { id: blog.id },
      include: { category: true, tags: { include: { tag: true } } },
    });
    res.status(201).json(full);
  })
);

adminRouter.put(
  "/blogs/:id",
  requirePermission("blogs"),
  asyncHandler(async (req, res) => {
    const body = blogWrite.parse(req.body);
    const existing = await prisma.blog.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new HttpError(404, "Blog not found");
    const slug =
      body.title === existing.title
        ? existing.slug
        : await uniqueSlug(body.title, async (s) => {
            return Boolean(
              await prisma.blog.findFirst({ where: { slug: s, NOT: { id: existing.id } } })
            );
          });
    const { tagIds, ...rest } = body;
    const readTime = estimateBlogReadTimeMinutes(rest.content, rest.contentAr);
    await prisma.blog.update({
      where: { id: existing.id },
      data: {
        categoryId: rest.categoryId,
        title: rest.title,
        titleAr: rest.titleAr,
        slug,
        content: rest.content,
        contentAr: rest.contentAr,
        readTime,
        featuredImageUrl: rest.featuredImageUrl ?? undefined,
        published: rest.published ?? false,
      },
    });
    if (tagIds) {
      await prisma.$transaction([
        prisma.blogTag.deleteMany({ where: { blogId: existing.id } }),
        prisma.blogTag.createMany({
          data: tagIds.map((tagId) => ({ blogId: existing.id, tagId })),
          skipDuplicates: true,
        }),
      ]);
    }
    const full = await prisma.blog.findUnique({
      where: { id: existing.id },
      include: { category: true, tags: { include: { tag: true } } },
    });
    res.json(full);
  })
);

adminRouter.delete(
  "/blogs/:id",
  requirePermission("blogs"),
  asyncHandler(async (req, res) => {
    await prisma.blog.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

/** Partners */
const partnerSchema = z.object({
  name: z.string().min(1).max(200),
  logoUrl: z.string().max(2048).optional().nullable(),
});

adminRouter.get(
  "/partners",
  requirePermission("partners"),
  asyncHandler(async (_req, res) => {
    res.json(await prisma.partner.findMany({ orderBy: { name: "asc" } }));
  })
);

adminRouter.post(
  "/partners",
  requirePermission("partners"),
  asyncHandler(async (req, res) => {
    const body = partnerSchema.parse(req.body);
    const row = await prisma.partner.create({ data: body });
    res.status(201).json(row);
  })
);

adminRouter.put(
  "/partners/:id",
  requirePermission("partners"),
  asyncHandler(async (req, res) => {
    const body = partnerSchema.partial().parse(req.body);
    const row = await prisma.partner.update({
      where: { id: req.params.id },
      data: body,
    });
    res.json(row);
  })
);

adminRouter.delete(
  "/partners/:id",
  requirePermission("partners"),
  asyncHandler(async (req, res) => {
    await prisma.partner.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

/** Portfolio categories */
const portfolioCatSchema = z.object({
  name: z.string().min(1).max(200),
  nameAr: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
});

adminRouter.get(
  "/portfolio-categories",
  requirePermission("portfolios"),
  asyncHandler(async (_req, res) => {
    res.json(
      await prisma.portfolioCategory.findMany({ orderBy: { name: "asc" } })
    );
  })
);

adminRouter.post(
  "/portfolio-categories",
  requirePermission("portfolios"),
  asyncHandler(async (req, res) => {
    const body = portfolioCatSchema.parse(req.body);
    const slug =
      body.slug ??
      (await uniqueSlug(body.name, async (s) => {
        return Boolean(
          await prisma.portfolioCategory.findUnique({ where: { slug: s } })
        );
      }));
    const row = await prisma.portfolioCategory.create({
      data: { name: body.name, nameAr: body.nameAr, slug },
    });
    res.status(201).json(row);
  })
);

adminRouter.put(
  "/portfolio-categories/:id",
  requirePermission("portfolios"),
  asyncHandler(async (req, res) => {
    const body = portfolioCatSchema.parse(req.body);
    const existing = await prisma.portfolioCategory.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new HttpError(404, "Category not found");
    let slug = existing.slug;
    if (body.slug) {
      const clash = await prisma.portfolioCategory.findFirst({
        where: { slug: body.slug, NOT: { id: existing.id } },
      });
      if (clash) throw new HttpError(409, "Slug already in use");
      slug = body.slug;
    } else {
      slug = await uniqueSlug(body.name, async (s) => {
        return Boolean(
          await prisma.portfolioCategory.findFirst({
            where: { slug: s, NOT: { id: existing.id } },
          })
        );
      });
    }
    const row = await prisma.portfolioCategory.update({
      where: { id: existing.id },
      data: {
        name: body.name,
        nameAr: body.nameAr,
        slug,
      },
    });
    res.json(row);
  })
);

adminRouter.delete(
  "/portfolio-categories/:id",
  requirePermission("portfolios"),
  asyncHandler(async (req, res) => {
    await prisma.portfolioCategory.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

/** Portfolios */
const portfolioWrite = z.object({
  categoryId: z.string(),
  title: z.string().min(1).max(300),
  titleAr: z.string().min(1).max(300),
  slug: z.string().min(1).max(320).optional(),
  shortDescription: z.string().min(1).max(2000).transform(normalizeMultiline),
  shortDescriptionAr: z.string().min(1).max(2000).transform(normalizeMultiline),
  featuredImageUrl: z.string().max(2048).optional().nullable(),
  link: z.string().max(2048).optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});

adminRouter.get(
  "/portfolios",
  requirePermission("portfolios"),
  asyncHandler(async (_req, res) => {
    const rows = await prisma.portfolio.findMany({
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(rows);
  })
);

adminRouter.post(
  "/portfolios",
  requirePermission("portfolios"),
  asyncHandler(async (req, res) => {
    const body = portfolioWrite.parse(req.body);
    const slug =
      body.slug ??
      (await uniqueSlug(body.title, async (s) => {
        return Boolean(await prisma.portfolio.findUnique({ where: { slug: s } }));
      }));
    const { tagIds, ...rest } = body;
    const row = await prisma.portfolio.create({
      data: {
        categoryId: rest.categoryId,
        title: rest.title,
        titleAr: rest.titleAr,
        slug,
        shortDescription: rest.shortDescription,
        shortDescriptionAr: rest.shortDescriptionAr,
        featuredImageUrl: rest.featuredImageUrl ?? undefined,
        link: rest.link ?? undefined,
      },
    });
    if (tagIds?.length) {
      await prisma.portfolioTag.createMany({
        data: tagIds.map((tagId) => ({
          portfolioId: row.id,
          tagId,
        })),
        skipDuplicates: true,
      });
    }
    const full = await prisma.portfolio.findUnique({
      where: { id: row.id },
      include: { category: true, tags: { include: { tag: true } } },
    });
    res.status(201).json(full);
  })
);

adminRouter.put(
  "/portfolios/:id",
  requirePermission("portfolios"),
  asyncHandler(async (req, res) => {
    const body = portfolioWrite.parse(req.body);
    const existing = await prisma.portfolio.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new HttpError(404, "Portfolio not found");
    let slug = existing.slug;
    if (body.slug) {
      const clash = await prisma.portfolio.findFirst({
        where: { slug: body.slug, NOT: { id: existing.id } },
      });
      if (clash) throw new HttpError(409, "Slug already in use");
      slug = body.slug;
    } else {
      slug = await uniqueSlug(body.title, async (s) => {
        return Boolean(
          await prisma.portfolio.findFirst({
            where: { slug: s, NOT: { id: existing.id } },
          })
        );
      });
    }
    const { tagIds, ...rest } = body;
    await prisma.portfolio.update({
      where: { id: existing.id },
      data: {
        categoryId: rest.categoryId,
        title: rest.title,
        titleAr: rest.titleAr,
        slug,
        shortDescription: rest.shortDescription,
        shortDescriptionAr: rest.shortDescriptionAr,
        featuredImageUrl: rest.featuredImageUrl ?? undefined,
        link: rest.link ?? undefined,
      },
    });
    if (tagIds) {
      await prisma.$transaction([
        prisma.portfolioTag.deleteMany({ where: { portfolioId: existing.id } }),
        prisma.portfolioTag.createMany({
          data: tagIds.map((tagId) => ({
            portfolioId: existing.id,
            tagId,
          })),
          skipDuplicates: true,
        }),
      ]);
    }
    const full = await prisma.portfolio.findUnique({
      where: { id: existing.id },
      include: { category: true, tags: { include: { tag: true } } },
    });
    res.json(full);
  })
);

adminRouter.delete(
  "/portfolios/:id",
  requirePermission("portfolios"),
  asyncHandler(async (req, res) => {
    await prisma.portfolio.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

/** Testimonials */
const testimonialSchema = z.object({
  name: z.string().min(1).max(200),
  nameAr: z.string().min(1).max(200),
  position: z.string().max(200).optional().nullable(),
  positionAr: z.string().min(1).max(200).transform(normalizeMultiline),
  rate: z.number().int().min(1).max(5),
  content: z.string().min(1).max(10_000).transform(normalizeMultiline),
  contentAr: z.string().min(1).max(10_000).transform(normalizeMultiline),
  imageUrl: z.string().max(2048).optional().nullable(),
});

adminRouter.get(
  "/testimonials",
  requirePermission("testimonials"),
  asyncHandler(async (_req, res) => {
    res.json(
      await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } })
    );
  })
);

adminRouter.post(
  "/testimonials",
  requirePermission("testimonials"),
  asyncHandler(async (req, res) => {
    const body = testimonialSchema.parse(req.body);
    const row = await prisma.testimonial.create({ data: body });
    res.status(201).json(row);
  })
);

adminRouter.put(
  "/testimonials/:id",
  requirePermission("testimonials"),
  asyncHandler(async (req, res) => {
    const existing = await prisma.testimonial.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new HttpError(404, "Testimonial not found");
    const body = testimonialSchema.parse(req.body);
    const row = await prisma.testimonial.update({
      where: { id: existing.id },
      data: {
        name: body.name,
        nameAr: body.nameAr,
        position: body.position ?? null,
        positionAr: body.positionAr,
        rate: body.rate,
        content: body.content,
        contentAr: body.contentAr,
        imageUrl: body.imageUrl ?? null,
      },
    });
    res.json(row);
  })
);

adminRouter.delete(
  "/testimonials/:id",
  requirePermission("testimonials"),
  asyncHandler(async (req, res) => {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

/** Service categories */
const serviceCatSchema = z.object({
  name: z.string().min(1).max(200),
  nameAr: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
});

adminRouter.get(
  "/service-categories",
  requirePermission("services"),
  asyncHandler(async (_req, res) => {
    res.json(
      await prisma.serviceCategory.findMany({ orderBy: { name: "asc" } })
    );
  })
);

adminRouter.post(
  "/service-categories",
  requirePermission("services"),
  asyncHandler(async (req, res) => {
    const body = serviceCatSchema.parse(req.body);
    const slug =
      body.slug ??
      (await uniqueSlug(body.name, async (s) => {
        return Boolean(
          await prisma.serviceCategory.findUnique({ where: { slug: s } })
        );
      }));
    const row = await prisma.serviceCategory.create({
      data: { name: body.name, nameAr: body.nameAr, slug },
    });
    res.status(201).json(row);
  })
);

adminRouter.put(
  "/service-categories/:id",
  requirePermission("services"),
  asyncHandler(async (req, res) => {
    const body = serviceCatSchema.parse(req.body);
    const existing = await prisma.serviceCategory.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new HttpError(404, "Category not found");
    let slug = existing.slug;
    if (body.slug) {
      const clash = await prisma.serviceCategory.findFirst({
        where: { slug: body.slug, NOT: { id: existing.id } },
      });
      if (clash) throw new HttpError(409, "Slug already in use");
      slug = body.slug;
    } else {
      slug = await uniqueSlug(body.name, async (s) => {
        return Boolean(
          await prisma.serviceCategory.findFirst({
            where: { slug: s, NOT: { id: existing.id } },
          })
        );
      });
    }
    const row = await prisma.serviceCategory.update({
      where: { id: existing.id },
      data: {
        name: body.name,
        nameAr: body.nameAr,
        slug,
      },
    });
    res.json(row);
  })
);

adminRouter.delete(
  "/service-categories/:id",
  requirePermission("services"),
  asyncHandler(async (req, res) => {
    await prisma.serviceCategory.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

/** Services */
const iconifyIconField = z
  .string()
  .min(1)
  .max(128)
  .refine(isIconifyIconId, {
    message: 'Icon must be an Iconify id (e.g. "mdi:web", "lucide:settings")',
  });

const serviceWrite = z.object({
  categoryId: z.string(),
  title: z.string().min(1).max(300),
  titleAr: z.string().min(1).max(300),
  description: z.string().min(1).transform(normalizeMultiline),
  descriptionAr: z.string().min(1).transform(normalizeMultiline),
  icon: iconifyIconField,
});

adminRouter.get(
  "/services",
  requirePermission("services"),
  asyncHandler(async (_req, res) => {
    const rows = await prisma.service.findMany({
      include: { category: true },
      orderBy: { title: "asc" },
    });
    res.json(rows);
  })
);

adminRouter.post(
  "/services",
  requirePermission("services"),
  asyncHandler(async (req, res) => {
    const body = serviceWrite.parse(req.body);
    const row = await prisma.service.create({
      data: {
        categoryId: body.categoryId,
        title: body.title,
        titleAr: body.titleAr,
        description: body.description,
        descriptionAr: body.descriptionAr,
        icon: body.icon,
      },
    });
    res.status(201).json(row);
  })
);

adminRouter.put(
  "/services/:id",
  requirePermission("services"),
  asyncHandler(async (req, res) => {
    const body = serviceWrite.parse(req.body);
    const existing = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new HttpError(404, "Service not found");
    const row = await prisma.service.update({
      where: { id: existing.id },
      data: {
        categoryId: body.categoryId,
        title: body.title,
        titleAr: body.titleAr,
        description: body.description,
        descriptionAr: body.descriptionAr,
        icon: body.icon,
      },
    });
    res.json(row);
  })
);

adminRouter.delete(
  "/services/:id",
  requirePermission("services"),
  asyncHandler(async (req, res) => {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

/** Packages */
const packageSchema = z.object({
  name: z.string().min(1).max(200),
  nameAr: z.string().min(1).max(200),
  shortDescription: z.string().min(1).max(2000).transform(normalizeMultiline),
  shortDescriptionAr: z.string().min(1).max(2000).transform(normalizeMultiline),
  price: z.coerce.number().nonnegative(),
  privileges: z.array(z.string().min(1).transform(normalizeMultiline)).min(1),
  privilegesAr: z.array(z.string().min(1).transform(normalizeMultiline)).min(1),
  sortOrder: z.number().int().optional(),
});

adminRouter.get(
  "/packages",
  requirePermission("packages"),
  asyncHandler(async (_req, res) => {
    const rows = await prisma.package.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    res.json(rows);
  })
);

adminRouter.post(
  "/packages",
  requirePermission("packages"),
  asyncHandler(async (req, res) => {
    const body = packageSchema.parse(req.body);
    const row = await prisma.package.create({
      data: {
        name: body.name,
        nameAr: body.nameAr,
        shortDescription: body.shortDescription,
        shortDescriptionAr: body.shortDescriptionAr,
        price: body.price,
        privileges: body.privileges,
        privilegesAr: body.privilegesAr,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    res.status(201).json(row);
  })
);

adminRouter.put(
  "/packages/:id",
  requirePermission("packages"),
  asyncHandler(async (req, res) => {
    const existing = await prisma.package.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new HttpError(404, "Package not found");
    const body = packageSchema.parse(req.body);
    const row = await prisma.package.update({
      where: { id: existing.id },
      data: {
        name: body.name,
        nameAr: body.nameAr,
        shortDescription: body.shortDescription,
        shortDescriptionAr: body.shortDescriptionAr,
        price: body.price,
        privileges: body.privileges,
        privilegesAr: body.privilegesAr,
        sortOrder: body.sortOrder ?? existing.sortOrder,
      },
    });
    res.json(row);
  })
);

adminRouter.delete(
  "/packages/:id",
  requirePermission("packages"),
  asyncHandler(async (req, res) => {
    await prisma.package.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

/** Contact submissions */
adminRouter.get(
  "/contacts",
  requirePermission("contacts"),
  asyncHandler(async (req, res) => {
    const raw = req.query.status;
    const status =
      raw === "NEW" || raw === "READ" || raw === "ARCHIVED" ? raw : undefined;
    const rows = await prisma.contactSubmission.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
    });
    res.json(rows);
  })
);

adminRouter.get(
  "/contacts/:id",
  requirePermission("contacts"),
  asyncHandler(async (req, res) => {
    const row = await prisma.contactSubmission.findUnique({
      where: { id: req.params.id },
    });
    if (!row) throw new HttpError(404, "Contact not found");
    res.json(row);
  })
);

adminRouter.patch(
  "/contacts/:id",
  requirePermission("contacts"),
  asyncHandler(async (req, res) => {
    const body = z
      .object({
        status: z.enum(["NEW", "READ", "ARCHIVED"]),
      })
      .parse(req.body);
    const row = await prisma.contactSubmission.update({
      where: { id: req.params.id },
      data: body,
    });
    res.json(row);
  })
);

adminRouter.delete(
  "/contacts/:id",
  requirePermission("contacts"),
  asyncHandler(async (req, res) => {
    await prisma.contactSubmission.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

/** Roles */
const roleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  permissions: z.array(z.string()).min(1),
});

adminRouter.get(
  "/roles",
  requirePermission("roles"),
  asyncHandler(async (_req, res) => {
    res.json(await prisma.role.findMany({ orderBy: { name: "asc" } }));
  })
);

adminRouter.post(
  "/roles",
  requirePermission("roles"),
  asyncHandler(async (req, res) => {
    const body = roleSchema.parse(req.body);
    const perms = assertPermissions(body.permissions);
    const row = await prisma.role.create({
      data: {
        name: body.name,
        description: body.description ?? undefined,
        permissions: perms,
      },
    });
    res.status(201).json(row);
  })
);

adminRouter.put(
  "/roles/:id",
  requirePermission("roles"),
  asyncHandler(async (req, res) => {
    const body = roleSchema.partial().parse(req.body);
    const existing = await prisma.role.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new HttpError(404, "Role not found");
    const perms =
      body.permissions !== undefined
        ? assertPermissions(body.permissions)
        : undefined;
    const row = await prisma.role.update({
      where: { id: existing.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.description !== undefined
          ? { description: body.description }
          : {}),
        ...(perms !== undefined ? { permissions: perms } : {}),
      },
    });
    res.json(row);
  })
);

adminRouter.delete(
  "/roles/:id",
  requirePermission("roles"),
  asyncHandler(async (req, res) => {
    const inUse = await prisma.admin.count({ where: { roleId: req.params.id } });
    if (inUse > 0) {
      throw new HttpError(409, "Role is assigned to admins");
    }
    await prisma.role.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

/** Admins */
const adminCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  name: z.string().max(200).optional().nullable(),
  roleId: z.string(),
  isActive: z.boolean().optional(),
});

const adminUpdateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).max(200).optional(),
  name: z.string().max(200).optional().nullable(),
  roleId: z.string().optional(),
  isActive: z.boolean().optional(),
});

adminRouter.get(
  "/admins",
  requirePermission("admins"),
  asyncHandler(async (_req, res) => {
    const rows = await prisma.admin.findMany({
      include: { role: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(
      rows.map((a) => ({
        id: a.id,
        email: a.email,
        name: a.name,
        isActive: a.isActive,
        role: a.role,
        createdAt: a.createdAt,
        createdById: a.createdById,
      }))
    );
  })
);

adminRouter.post(
  "/admins",
  requirePermission("admins"),
  asyncHandler(async (req: AuthedRequest, res) => {
    const body = adminCreateSchema.parse(req.body);
    const actor = req.admin!;
    if (!hasPermission(actor.permissions, "admins")) {
      throw new HttpError(403, "Insufficient permissions");
    }
    const targetRole = await prisma.role.findUnique({
      where: { id: body.roleId },
    });
    if (!targetRole) throw new HttpError(400, "Invalid role");
    const targetPerms = parsePermissions(targetRole.permissions);
    if (
      targetPerms.includes("*") &&
      !actor.permissions.includes("*")
    ) {
      throw new HttpError(403, "Only super admins can assign the super admin role");
    }
    const passwordHash = await bcrypt.hash(body.password, 12);
    const row = await prisma.admin.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash,
        name: body.name ?? undefined,
        roleId: body.roleId,
        isActive: body.isActive ?? true,
        createdById: actor.id,
      },
      include: { role: true },
    });
    res.status(201).json({
      id: row.id,
      email: row.email,
      name: row.name,
      isActive: row.isActive,
      role: row.role,
    });
  })
);

adminRouter.put(
  "/admins/:id",
  requirePermission("admins"),
  asyncHandler(async (req: AuthedRequest, res) => {
    const body = adminUpdateSchema.parse(req.body);
    const actor = req.admin!;
    const existing = await prisma.admin.findUnique({
      where: { id: req.params.id },
      include: { role: true },
    });
    if (!existing) throw new HttpError(404, "Admin not found");

    if (body.roleId) {
      const targetRole = await prisma.role.findUnique({
        where: { id: body.roleId },
      });
      if (!targetRole) throw new HttpError(400, "Invalid role");
      const targetPerms = parsePermissions(targetRole.permissions);
      if (targetPerms.includes("*") && !actor.permissions.includes("*")) {
        throw new HttpError(403, "Only super admins can assign the super admin role");
      }
    }

    if (
      existing.id === actor.id &&
      body.isActive === false
    ) {
      throw new HttpError(400, "You cannot deactivate your own account");
    }

    const passwordHash = body.password
      ? await bcrypt.hash(body.password, 12)
      : undefined;

    const row = await prisma.admin.update({
      where: { id: existing.id },
      data: {
        ...(body.email !== undefined ? { email: body.email.toLowerCase() } : {}),
        ...(passwordHash !== undefined ? { passwordHash } : {}),
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.roleId !== undefined ? { roleId: body.roleId } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      },
      include: { role: true },
    });

    res.json({
      id: row.id,
      email: row.email,
      name: row.name,
      isActive: row.isActive,
      role: row.role,
    });
  })
);

adminRouter.delete(
  "/admins/:id",
  requirePermission("admins"),
  asyncHandler(async (req: AuthedRequest, res) => {
    if (req.params.id === req.admin!.id) {
      throw new HttpError(400, "You cannot delete your own account");
    }
    await prisma.admin.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export { adminRouter };
