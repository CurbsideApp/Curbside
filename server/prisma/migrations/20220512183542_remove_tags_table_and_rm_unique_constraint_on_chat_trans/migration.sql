/*
  Warnings:

  - You are about to drop the `_ListingToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tags` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ListingToTag" DROP CONSTRAINT "_ListingToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ListingToTag" DROP CONSTRAINT "_ListingToTag_B_fkey";

-- DropIndex
DROP INDEX "Chat_buyerId_key";

-- DropIndex
DROP INDEX "Chat_sellerId_key";

-- DropIndex
DROP INDEX "Transaction_buyerId_key";

-- DropIndex
DROP INDEX "Transaction_sellerId_key";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "tags" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ListingToTag";

-- DropTable
DROP TABLE "Tag";
