/*
  Warnings:

  - You are about to drop the column `heroImageUrl` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "heroImageUrl",
ADD COLUMN     "location" TEXT;
