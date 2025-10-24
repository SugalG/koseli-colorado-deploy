/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `News` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "imageUrl",
ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
