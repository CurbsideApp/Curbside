/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ListingToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ListingToTag" DROP CONSTRAINT "_ListingToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ListingToTag" DROP CONSTRAINT "_ListingToTag_B_fkey";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_ListingToTag";
