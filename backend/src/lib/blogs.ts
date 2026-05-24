import { prisma } from "./prisma";

export type TopReadBlog = {
  id: string;
  title: string;
  titleAr: string;
  slug: string;
  img: string | null;
  readCount: number;
  createdAt: Date;
};

/** Published blogs with the highest read counts (ties broken by newest). */
export async function getTopReadBlogs(limit = 3): Promise<TopReadBlog[]> {
  const rows = await prisma.blog.findMany({
    where: { published: true },
    orderBy: [{ readCount: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: {
      id: true,
      title: true,
      titleAr: true,
      slug: true,
      featuredImageUrl: true,
      readCount: true,
      createdAt: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    titleAr: row.titleAr,
    slug: row.slug,
    img: row.featuredImageUrl,
    readCount: row.readCount,
    createdAt: row.createdAt,
  }));
}

/** Increment read count when a visitor opens a published blog post. */
export async function recordBlogRead(slug: string): Promise<boolean> {
  const result = await prisma.blog.updateMany({
    where: { slug, published: true },
    data: { readCount: { increment: 1 } },
  });
  return result.count > 0;
}
