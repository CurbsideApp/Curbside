/*
  Warnings:

  - You are about to drop the column `tags` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ListingToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ListingToTag_AB_unique" ON "_ListingToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ListingToTag_B_index" ON "_ListingToTag"("B");

-- AddForeignKey
ALTER TABLE "_ListingToTag" ADD CONSTRAINT "_ListingToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingToTag" ADD CONSTRAINT "_ListingToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
