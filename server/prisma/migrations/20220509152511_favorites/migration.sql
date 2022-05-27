/*
  Warnings:

  - The `status` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Listing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `condition` on the `Listing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('available', 'reserved', 'sold');

-- CreateEnum
CREATE TYPE "ListingCondition" AS ENUM ('new', 'gentlyUsed', 'used');

-- CreateEnum
CREATE TYPE "ChatStatus" AS ENUM ('open', 'closed');

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "status",
ADD COLUMN     "status" "ChatStatus" NOT NULL DEFAULT E'open';

-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "transactionId" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ListingStatus" NOT NULL DEFAULT E'available',
DROP COLUMN "condition",
ADD COLUMN     "condition" "ListingCondition" NOT NULL;

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "_favorites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_favorites_AB_unique" ON "_favorites"("A", "B");

-- CreateIndex
CREATE INDEX "_favorites_B_index" ON "_favorites"("B");

-- AddForeignKey
ALTER TABLE "_favorites" ADD CONSTRAINT "_favorites_A_fkey" FOREIGN KEY ("A") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favorites" ADD CONSTRAINT "_favorites_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
