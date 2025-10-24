-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;
