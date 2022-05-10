/*
  Warnings:

  - You are about to drop the column `images` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `priceInCents` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "images",
ADD COLUMN     "photoUrls" TEXT[],
ADD COLUMN     "priceInCents" INTEGER NOT NULL;
