-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "titleAr" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Blog" ADD COLUMN "contentAr" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "BlogCategory" ADD COLUMN "nameAr" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "PortfolioCategory" ADD COLUMN "nameAr" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN "titleAr" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Portfolio" ADD COLUMN "shortDescriptionAr" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "PrivacyPolicy" ADD COLUMN "contentAr" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "ServiceCategory" ADD COLUMN "nameAr" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN "titleAr" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Service" ADD COLUMN "descriptionAr" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Package" ADD COLUMN "nameAr" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Package" ADD COLUMN "shortDescriptionAr" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Package" ADD COLUMN "privilegesAr" JSONB NOT NULL DEFAULT '[]'::jsonb;

-- AlterTable
ALTER TABLE "StaticSiteInfo" ADD COLUMN "addressAr" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN "nameAr" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Testimonial" ADD COLUMN "positionAr" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Testimonial" ADD COLUMN "contentAr" TEXT NOT NULL DEFAULT '';
