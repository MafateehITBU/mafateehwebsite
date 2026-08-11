import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { HttpError } from "../lib/httpError";
import { getTopReadBlogs, recordBlogRead } from "../lib/blogs";
import { sendContactNotification } from "../lib/mail";
import { sanitizeRichHtml } from "../lib/richHtml";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
});

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  phoneNumber: z.string().max(50).optional(),
  email: z.string().email(),
  service: z.string().max(200).optional(),
  inquiry: z.string().min(1).max(10_000),
});

export const publicRouter = Router();

publicRouter.get(
  "/static-site-info",
  asyncHandler(async (_req, res) => {
    const row = await prisma.staticSiteInfo.findFirst();
    res.json(row ?? null);
  })
);

publicRouter.get(
  "/privacy-policy",
  asyncHandler(async (_req, res) => {
    const row = await prisma.privacyPolicy.findFirst();
    if (!row) {
      res.json(null);
      return;
    }
    res.json({
      ...row,
      content: sanitizeRichHtml(row.content, { extended: true }),
      contentAr: sanitizeRichHtml(row.contentAr, { extended: true }),
    });
  })
);

publicRouter.get(
  "/terms-and-conditions",
  asyncHandler(async (_req, res) => {
    const row = await prisma.termsAndConditions.findFirst();
    if (!row) {
      res.json(null);
      return;
    }
    res.json({
      ...row,
      content: sanitizeRichHtml(row.content, { extended: true }),
      contentAr: sanitizeRichHtml(row.contentAr, { extended: true }),
    });
  })
);

publicRouter.get(
  "/seo",
  asyncHandler(async (_req, res) => {
    const row = await prisma.sEOSettings.findFirst();
    res.json(row ?? null);
  })
);

publicRouter.get(
  "/blog-categories",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
    });
    res.json(rows);
  })
);

publicRouter.get(
  "/tags",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    res.json(rows);
  })
);

publicRouter.get(
  "/blogs",
  asyncHandler(async (req, res) => {
    const categorySlug = typeof req.query.categorySlug === "string" ? req.query.categorySlug : undefined;
    const tagSlug = typeof req.query.tagSlug === "string" ? req.query.tagSlug : undefined;

    const rows = await prisma.blog.findMany({
      where: {
        published: true,
        ...(categorySlug
          ? { category: { slug: categorySlug } }
          : {}),
        ...(tagSlug
          ? { tags: { some: { tag: { slug: tagSlug } } } }
          : {}),
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(rows);
  })
);

publicRouter.get(
  "/blogs/most-read",
  asyncHandler(async (_req, res) => {
    const rows = await getTopReadBlogs(3);
    res.json(rows);
  })
);

publicRouter.get(
  "/blogs/:slug",
  asyncHandler(async (req, res) => {
    const row = await prisma.blog.findFirst({
      where: { slug: req.params.slug, published: true },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });
    if (!row) throw new HttpError(404, "Blog not found");
    res.json(row);
  })
);

publicRouter.post(
  "/blogs/:slug/view",
  asyncHandler(async (req, res) => {
    const recorded = await recordBlogRead(req.params.slug);
    if (!recorded) throw new HttpError(404, "Blog not found");
    res.status(204).send();
  })
);

publicRouter.get(
  "/partners",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.partner.findMany({ orderBy: { name: "asc" } });
    res.json(rows);
  })
);

publicRouter.get(
  "/portfolio-categories",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.portfolioCategory.findMany({
      orderBy: { name: "asc" },
    });
    res.json(rows);
  })
);

publicRouter.get(
  "/portfolios",
  asyncHandler(async (req, res) => {
    const categorySlug =
      typeof req.query.categorySlug === "string" ? req.query.categorySlug : undefined;
    const tagSlug = typeof req.query.tagSlug === "string" ? req.query.tagSlug : undefined;
    const rows = await prisma.portfolio.findMany({
      where: {
        ...(categorySlug
          ? { category: { slug: categorySlug } }
          : {}),
        ...(tagSlug
          ? { tags: { some: { tag: { slug: tagSlug } } } }
          : {}),
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(rows);
  })
);

publicRouter.get(
  "/portfolios/:slug",
  asyncHandler(async (req, res) => {
    const row = await prisma.portfolio.findFirst({
      where: { slug: req.params.slug },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });
    if (!row) throw new HttpError(404, "Portfolio not found");
    res.json(row);
  })
);

publicRouter.get(
  "/testimonials",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(rows);
  })
);

publicRouter.get(
  "/service-categories",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.serviceCategory.findMany({
      orderBy: { name: "asc" },
      include: { services: { orderBy: { title: "asc" } } },
    });
    res.json(rows);
  })
);

publicRouter.get(
  "/services",
  asyncHandler(async (req, res) => {
    const categorySlug =
      typeof req.query.categorySlug === "string" ? req.query.categorySlug : undefined;
    const rows = await prisma.service.findMany({
      where: categorySlug
        ? { category: { slug: categorySlug } }
        : {},
      include: { category: true },
      orderBy: { title: "asc" },
    });
    res.json(rows);
  })
);

publicRouter.get(
  "/packages",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.package.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    res.json(rows);
  })
);

publicRouter.post(
  "/contact",
  contactLimiter,
  asyncHandler(async (req, res) => {
    const body = contactSchema.parse(req.body);
    const created = await prisma.contactSubmission.create({ data: body });

    try {
      await sendContactNotification({
        id: created.id,
        name: created.name,
        email: created.email,
        phoneNumber: created.phoneNumber,
        service: created.service,
        inquiry: created.inquiry,
        createdAt: created.createdAt,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Contact notification email failed:", err);
    }

    res.status(201).json(created);
  })
);
